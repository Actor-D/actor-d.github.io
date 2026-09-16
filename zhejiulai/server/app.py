from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import uuid
import re
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask_cors import CORS

import os
from werkzeug.utils import secure_filename
from flask import current_app
from flask import send_from_directory

from datetime import datetime
from openai import OpenAI

import joblib
import pandas as pd
import logging

UPLOAD_FOLDER = 'uploads'  # 确保创建这个目录
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# 初始化Flask应用
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-only-change-me')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zju_delivery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB限制

# 初始化数据库
db = SQLAlchemy(app)

# 允许跨域
CORS(app,
     resources={r'/*': {'origins': ["http://localhost:5173", "http://127.0.0.1:5000  "], "supports_credentials": True}})

# 常量定义
POINTS_EXCHANGE_RATE = 10  # 1元=10积分


# 数据库模型
class User(db.Model):
    __tablename__ = 'users'  # 明确指定表名

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    points = db.Column(db.Integer, default=100)  # 用户积分
    identity = db.Column(db.String(20), default='student')
    campus = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # 关系
    addresses = db.relationship('Address', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)


class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 注意表名
    icon = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    detail = db.Column(db.String(200), nullable=False)
    time = db.Column(db.String(50))
    is_default = db.Column(db.Boolean, default=False)


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255))
    order_id = db.Column(db.String(36), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # 注意表名

    # 订单信息
    food_name = db.Column(db.String(100), nullable=False)
    locker_info = db.Column(db.String(100))
    is_urgent = db.Column(db.Boolean, default=False)
    size = db.Column(db.String(20), default='medium')
    notes = db.Column(db.Text, nullable=True)

    # 地址信息
    delivery_address = db.Column(db.String(200))
    receiver_address = db.Column(db.String(200))

    # 支付信息
    delivery_fee_cash = db.Column(db.Float, default=5.0)
    delivery_fee_points = db.Column(db.Integer, default=0)  # 动态计算
    payment_method = db.Column(db.String(20))
    payment_currency = db.Column(db.String(10))
    payment_amount = db.Column(db.Float)
    payment_time = db.Column(db.DateTime)
    payment_status = db.Column(db.String(20), default='draft')  # draft/pending/paid
    confirm = db.Column(db.Integer, default=0, nullable=False)

    # 预估距离
    distance = db.Column(db.Float, default=0.0)  # 新增字段

    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)


# 辅助函数
def validate_phone(phone):
    return re.match(r'^1[3-9]\d{9}$', phone)


def validate_student_id(student_id):
    return re.match(r'^\d{10}$', student_id)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)

    return decorated


# 用户注册
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        required_fields = ['student_id', 'name', 'phone', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'message': f'{field} is required!'}), 400
        if not validate_student_id(data['student_id']):
            return jsonify({'success': False, 'message': '学号必须是10位数字'}), 400
        if not validate_phone(data['phone']):
            return jsonify({'success': False, 'message': '请输入有效的手机号'}), 400
        if User.query.filter_by(student_id=data['student_id']).first():
            return jsonify({'success': False, 'message': '学号已存在'}), 400
        if User.query.filter_by(phone=data['phone']).first():
            return jsonify({'success': False, 'message': '手机号已存在'}), 400
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            public_id=str(uuid.uuid4()),
            student_id=data['student_id'],
            name=data['name'],
            phone=data['phone'],
            password=hashed_password,
            identity=data.get('identity', 'student'),
            campus=data.get('campus')
        )
        db.session.add(new_user)
        db.session.commit()
        token = jwt.encode({
            'public_id': new_user.public_id,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({
            'success': True,
            'message': '注册成功',
            'token': token,
            'user': {
                'student_id': new_user.student_id,
                'name': new_user.name,
                'phone': new_user.phone,
                'identity': new_user.identity,
                'campus': new_user.campus
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# 用户登录
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not data.get('student_id') or not data.get('password') or not data.get('campus'):
            return jsonify({'success': False, 'message': '学号、密码和校区是必填项'}), 400
        user = User.query.filter_by(student_id=data['student_id']).first()
        if not user:
            return jsonify({'success': False, 'message': '用户不存在'}), 401
        if not check_password_hash(user.password, data['password']):
            return jsonify({'success': False, 'message': '密码错误'}), 401
        if user.campus and data['campus'] != user.campus:
            return jsonify({'success': False, 'message': '校区不匹配'}), 401
        user.last_login = datetime.utcnow()
        user.campus = data['campus']
        db.session.commit()
        token = jwt.encode({
            'public_id': user.public_id,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({
            'success': True,
            'message': '登录成功',
            'token': token,
            'user': {
                'student_id': user.student_id,
                'name': user.name,
                'phone': user.phone,
                'identity': user.identity,
                'campus': user.campus
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# 获取用户信息
@app.route('/api/user_profile', methods=['GET'])
@token_required
def user_profile(current_user):
    utc_time = current_user.created_at.replace(tzinfo=timezone.utc)
    shanghai_time = utc_time.astimezone(timezone(timedelta(hours=8)))
    return jsonify({
        'success': True,
        'user': {
            'student_id': current_user.student_id,
            'name': current_user.name,
            'phone': current_user.phone,
            'identity': current_user.identity,
            'campus': current_user.campus,
            'points': current_user.points,
            'created_at': shanghai_time.strftime('%Y-%m-%d %H:%M:%S')
        }
    })


# 更新用户信息
@app.route('/api/update_profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.get_json()
        if 'name' in data:
            current_user.name = data['name']
        if 'phone' in data:
            current_user.phone = data['phone']
        if 'campus' in data:
            current_user.campus = data['campus']
        db.session.commit()
        return jsonify({
            'success': True,
            'message': '个人资料更新成功',
            'user': {
                'student_id': current_user.student_id,
                'name': current_user.name,
                'phone': current_user.phone,
                'identity': current_user.identity,
                'campus': current_user.campus
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# 获取用户所有地址
@app.route('/api/addresses', methods=['GET'])
@token_required
def get_addresses(current_user):
    addresses = Address.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': addr.id,
        'icon': addr.icon,
        'title': addr.title,
        'detail': addr.detail,
        'time': addr.time,
        'is_default': addr.is_default
    } for addr in addresses])


# 添加新地址
@app.route('/api/addresses', methods=['POST'])
@token_required
def add_address(current_user):
    data = request.get_json()
    new_address = Address(
        user_id=current_user.id,
        icon=data['icon'],
        title=data['title'],
        detail=data['detail'],
        is_default=data.get('is_default', False)
    )
    db.session.add(new_address)
    db.session.commit()
    return jsonify({'message': 'Address added successfully'}), 201


# 删除地址
@app.route('/api/addresses/<int:address_id>', methods=['DELETE'])
@token_required
def delete_address(current_user, address_id):
    address = Address.query.filter_by(user_id=current_user.id, id=address_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404
    db.session.delete(address)
    db.session.commit()
    return jsonify({'message': 'Address deleted successfully'})


# 设置默认地址
@app.route('/api/addresses/<int:address_id>/default', methods=['POST'])
@token_required
def set_default_address(current_user, address_id):
    address = Address.query.filter_by(user_id=current_user.id, id=address_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404
    Address.query.filter_by(user_id=current_user.id).update({'is_default': False})
    address.is_default = True
    db.session.commit()
    return jsonify({'message': 'Default address updated successfully'})


# 取消默认地址
@app.route('/api/addresses/<int:address_id>/cancel_default', methods=['POST'])
@token_required
def cancel_default_address(current_user, address_id):
    address = Address.query.filter_by(user_id=current_user.id, id=address_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404
    address.is_default = False
    db.session.commit()
    return jsonify({'message': 'Default address canceled successfully'})


# 更新地址
@app.route('/api/addresses/<int:address_id>', methods=['PUT'])
@token_required
def update_address(current_user, address_id):
    address = Address.query.filter_by(user_id=current_user.id, id=address_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404

    data = request.get_json()
    address.icon = data.get('icon', address.icon)
    address.title = data.get('title', address.title)
    address.detail = data.get('detail', address.detail)
    address.is_default = data.get('is_default', address.is_default)

    db.session.commit()
    return jsonify({'message': 'Address updated successfully'})


# 订单部分
# 配置日志
logging.basicConfig(level=logging.DEBUG)

def predict_delivery_fee_points(order):
    try:
        # 获取当前文件的绝对路径
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # 构建模型文件的路径
        model_path = os.path.join(current_dir, 'model.pkl')
        # 加载模型
        model = joblib.load(model_path)
        logging.debug(f"Model loaded successfully from {model_path}")

        input_data = pd.DataFrame({
            'size': [order.size],      # 选项: 'small', 'medium', 'large'
            'distance': [order.distance],      # 配送距离（公里）
            'urgent': ['yes' if order.is_urgent else 'no']       # 是否加急: 'yes' 或 'no'
        })
        delivery_fee_points = model.predict(input_data)
        logging.debug(f"Predicted delivery fee points: {delivery_fee_points[0]}")
        return int(delivery_fee_points[0])
    except Exception as e:
        logging.error(f"Error predicting delivery fee points: {str(e)}")
        return 0

@app.route('/api/test_predict', methods=['GET'])
def test_predict():
    try:
        # 创建一个测试订单对象
        test_order = Order(
            size='medium',
            distance=2.5,
            is_urgent=False
        )
        # 调用预测函数
        predicted_points = predict_delivery_fee_points(test_order)
        return jsonify({
            'success': True,
            'predicted_points': predicted_points
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# 创建订单
@app.route('/api/order', methods=['POST'])
@token_required
def create_order(current_user):
    """处理页面1和页面2的数据提交"""
    data = request.get_json()
    # 根据是否加急计算两种配送费
    is_urgent = data.get('is_urgent', False)
    delivery_fee_cash = 7.0 if is_urgent else 5.0

    # 验证必要字段
    required_fields = ['food_name', 'size']  # 移除distance字段的检查
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'Missing {field}'}), 400

    try:
        new_order = Order(
            order_id=str(uuid.uuid4()),
            user_id=current_user.id,
            # 页面1数据
            food_name=data['food_name'],
            locker_info=data.get('locker_info'),
            is_urgent=is_urgent,  # 使用传入的值
            size=data['size'],
            notes=data.get('notes'),
            image_url=data.get('image_url'),
            delivery_fee_cash=delivery_fee_cash,
            delivery_fee_points=0,  # 初始化为0，稍后通过模型预测
            distance=0.0,  # 初始化distance为0.0
            # 初始化状态
            payment_status='draft'  # 草稿状态
        )
        db.session.add(new_order)
        db.session.commit()

        # 调用模型预测积分花费
        new_order.delivery_fee_points = predict_delivery_fee_points(new_order)
        db.session.commit()

        return jsonify({
            'success': True,
            'order_id': new_order.order_id,
            'next_step': '/payment-method'  # 指引前端跳转到下一页
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/order/<order_id>/address', methods=['POST'])
@token_required
def update_order_address(current_user, order_id):
    data = request.get_json()

    # 验证必填字段
    if not data.get('delivery_address'):
        return jsonify({'success': False, 'message': 'Missing delivery_address'}), 400

    try:
        order = Order.query.filter_by(
            order_id=order_id,
            user_id=current_user.id
        ).first_or_404()

        # 处理接收地址（可能是字符串或地址ID）
        receiver_input = data.get('receiver_address', '')

        if receiver_input.isdigit():  # 如果是数字ID
            address = Address.query.filter_by(
                id=int(receiver_input),
                user_id=current_user.id
            ).first()
            if address:
                order.receiver_address = f"{address.title} {address.detail}"
            else:
                order.receiver_address = ""
        else:  # 直接输入的字符串
            order.receiver_address = receiver_input

        order.delivery_address = data['delivery_address']
        order.distance = data.get('distance', 0.0)  # 接收并处理 distance 字段

        db.session.commit()

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/order', methods=['GET'])
@token_required
def get_orders(current_user):
    """订单列表"""
    orders = Order.query.filter_by(user_id=current_user.id, confirm=1) \
        .order_by(Order.created_at.desc()) \
        .all()

    return jsonify({
        'success': True,
        'orders': [{
            'id': o.order_id,
            'food_name': o.food_name,
            'image-url': o.image_url,
            'delivery_address': o.delivery_address,
            'is_urgent': o.is_urgent,
            'payment_method': o.payment_method,
            'payment_amount': o.payment_amount,
            'status': o.payment_status,
            'created_at': o.created_at.isoformat()
        } for o in orders]
    })


@app.route('/api/order/<order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    """获取单个订单详情"""
    order = Order.query.filter_by(
        order_id=order_id,
        user_id=current_user.id
    ).first_or_404()

    return jsonify({
        'success': True,
        'order': {
            'id': order.order_id,
            'food_name': order.food_name,
            'image_url': order.image_url,
            'size': order.size,
            'is_urgent': order.is_urgent,
            'payment_method': order.payment_method,
            'payment_amount': order.payment_amount,
            'status': order.payment_status,
            'created_at': order.created_at.isoformat(),
            'distance': order.distance,
            'receiver_address': order.receiver_address,
            'delivery_address': order.delivery_address,
            'delivery_fee_cash': order.delivery_fee_cash,
            'delivery_fee_points': order.delivery_fee_points  # 确保返回这个值
        }
    })


# 上传订单图片
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # 生成唯一文件名防止冲突
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)

        # 确保上传目录存在
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)

        # 返回相对URL（生产环境应返回完整CDN URL）
        return jsonify({
            'success': True,
            'imageUrl': f"/{UPLOAD_FOLDER}/{unique_filename}"
        })

    return jsonify({'error': 'Allowed file types are png, jpg, jpeg, gif'}), 400


@app.route('/api/orders/<order_id>/images', methods=['GET'])
@token_required
def get_order_images(current_user, order_id):
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({
        'images': [order.image_url]  # 如果是多图则返回数组
    })


# 更新订单支付状态并处理积分支付
@app.route('/api/order/<order_id>/payment', methods=['PUT'])
@token_required
def update_payment(current_user, order_id):
    """处理页面3的支付方式选择"""
    data = request.get_json()

    try:
        order = Order.query.filter_by(
            order_id=order_id,
            user_id=current_user.id
        ).first_or_404()

        payment_method = data['payment_method']
        if payment_method == 'points':
            if current_user.points < order.delivery_fee_points:
                return jsonify({'success': False, 'message': '积分不足'}), 400
            current_user.points -= order.delivery_fee_points
            order.payment_currency = 'points'
            order.payment_method = 'points'
            order.payment_amount = order.delivery_fee_points
        else:
            order.payment_currency = 'cash'
            order.payment_method = 'cash'
            order.payment_amount = order.delivery_fee_cash

        order.payment_status = 'paid'
        order.confirm = 1
        db.session.commit()

        return jsonify({
            'success': True,
            'delivery_fee': order.delivery_fee_cash,
            'next_step': '/Pay',
            'delivery_fee_points': order.delivery_fee_points if order.payment_currency == 'points' else None,
            'currency_type': order.payment_currency
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

class Good(db.Model):
    __tablename__ = 'goods'

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255))
    goodorder_id = db.Column(db.String(36), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # 注意表名

    # 订单信息
    good_name = db.Column(db.String(100), nullable=False)
    good_type = db.Column(db.String(20), nullable=False)
    good_size = db.Column(db.String(100), nullable=False)
    is_urgent = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, nullable=True)

    # 地址信息
    delivery_address = db.Column(db.String(200))
    receiver_address = db.Column(db.String(200))

    # 支付信息
    delivery_fee_cash = db.Column(db.Float, default=5.0)
    delivery_fee_points = db.Column(db.Integer, default=50)
    payment_method = db.Column(db.String(20))
    payment_currency = db.Column(db.String(10))
    payment_amount = db.Column(db.Float)
    payment_time = db.Column(db.DateTime)
    payment_status = db.Column(db.String(20), default='draft')  # draft/pending/paid
    confirm = db.Column(db.Integer, default=0, nullable=False)

    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)


# 创建物品配送订单
@app.route('/api/good', methods=['POST'])
@token_required
def create_goodorder(current_user):
    """处理页面1和页面2的数据提交"""
    data = request.get_json()
    # 根据是否加急计算两种配送费
    is_urgent = data.get('is_urgent', False)
    delivery_fee_cash = 7.0 if is_urgent else 5.0
    delivery_fee_points = 10  # 每个订单固定花费10积分

    # 验证必要字段
    required_fields = ['good_name', 'good_type', 'good_size']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'Missing {field}'}), 400

    try:
        new_goodorder = Good(
            goodorder_id=str(uuid.uuid4()),
            user_id=current_user.id,
            # 页面1数据
            good_name=data['good_name'],
            good_size=data['good_size'],
            good_type=data['good_type'],
            is_urgent=data.get('is_urgent', False),
            notes=data.get('notes'),
            image_url=data.get('image_url'),
            delivery_fee_cash=delivery_fee_cash,
            delivery_fee_points=delivery_fee_points,  # 固定设置为10积分
            # 初始化状态
            payment_status='draft'  # 草稿状态
        )
        db.session.add(new_goodorder)
        db.session.commit()

        return jsonify({
            'success': True,
            'goodorder_id': new_goodorder.goodorder_id,
            'next_step': '/payment-method'  # 指引前端跳转到下一页
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/good/<goodorder_id>/address', methods=['POST'])
@token_required
def update_goodorder_address(current_user, goodorder_id):
    data = request.get_json()

    # 验证必填字段
    if not data.get('delivery_address'):
        return jsonify({'success': False, 'message': 'Missing delivery_address'}), 400

    try:
        order = Good.query.filter_by(
            goodorder_id=goodorder_id,
            user_id=current_user.id
        ).first_or_404()

        # 处理接收地址（可能是字符串或地址ID）
        receiver_input = data.get('receiver_address', '')

        if receiver_input.isdigit():  # 如果是数字ID
            address = Address.query.filter_by(
                id=int(receiver_input),
                user_id=current_user.id
            ).first()
            if address:
                order.receiver_address = f"{address.title} {address.detail}"
            else:
                order.receiver_address = ""
        else:  # 直接输入的字符串
            order.receiver_address = receiver_input

        order.delivery_address = data['delivery_address']
        db.session.commit()

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/good/<goodorder_id>', methods=['GET'])
@token_required
def get_goodorder(current_user, goodorder_id):
    """获取单个订单详情"""
    order = Good.query.filter_by(
        goodorder_id=goodorder_id,
        user_id=current_user.id
    ).first_or_404()

    return jsonify({
        'success': True,
        'good_name': order.good_name,
        'good_size': order.good_size,
        'good_type': order.good_type,
        'goodorder_id': order.goodorder_id,
        'paymentMethod': order.payment_method,
        'notes': order.notes,
        'created_at': order.created_at.isoformat(),
        'receiver_address': order.receiver_address,
        'amount': order.payment_amount,
        'delivery_address': order.delivery_address,
        'is_urgent': order.is_urgent,
        'status': order.payment_status,
        'delivery_fee_cash': order.delivery_fee_cash,
        'delivery_fee_points': order.delivery_fee_points  # 确保返回这个值
    })


@app.route('/api/good/<goodorder_id>/payment', methods=['PUT'])
@token_required
def update_goodpayment(current_user, goodorder_id):
    """处理页面3的支付方式选择"""
    data = request.get_json()

    try:
        order = Good.query.filter_by(
            goodorder_id=goodorder_id,
            user_id=current_user.id
        ).first_or_404()

        payment_method = data['payment_method']
        if payment_method == 'points':
            if current_user.points < 10:
                return jsonify({'success': False, 'message': '积分不足'}), 400
            current_user.points -= 10
            order.payment_currency = 'points'
            order.payment_method = 'points'
            order.payment_amount = 10
        else:
            order.payment_currency = 'cash'
            order.payment_method = 'cash'
            order.payment_amount = order.delivery_fee_cash

        order.payment_status = 'paid'
        order.confirm = 1
        db.session.commit()

        return jsonify({
            'success': True,
            'delivery_fee': order.delivery_fee_cash,
            'next_step': '/Pay',
            'delivery_fee_points': order.delivery_fee_points if order.payment_currency == 'points' else None,
            'currency_type': order.payment_currency
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/good/<goodorder_id>/images', methods=['GET'])
@token_required
def get_goodorder_images(current_user, goodorder_id):
    order = Good.query.filter_by(goodorder_id=goodorder_id, user_id=current_user.id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({
        'images': [order.image_url]  # 如果是多图则返回数组
    })


@app.route('/api/good', methods=['GET'])
@token_required
def get_goodorders(current_user):
    """订单列表"""
    orders = Good.query.filter_by(user_id=current_user.id, confirm=1) \
        .order_by(Good.created_at.desc()) \
        .all()

    return jsonify({
        'success': True,
        'orders': [{
            'id': o.goodorder_id,
            'good_name': o.good_name,
            'image-url': o.image_url,
            'good_size': o.good_size,
            "good_type": o.good_type,
            'delivery_address': o.delivery_address,
            'is_urgent': o.is_urgent,
            'payment_method': o.payment_method,
            'payment_amount': o.payment_amount,
            'status': o.payment_status,
            'created_at': o.created_at.isoformat()
        } for o in orders]
    })


# ==== 数据库模型（追加到原有模型） ====
class Feedback(db.Model):
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # bug/suggestion/complaint
    content = db.Column(db.String(500), nullable=False)
    contact_info = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ==== 反馈提交路由（追加到路由部分） ====
@app.route('/api/feedback', methods=['POST'])
@token_required
def submit_feedback(current_user):
    try:
        data = request.get_json()
        # 验证必要字段
        if not data.get('type') or not data.get('content'):
            return jsonify({'success': False, 'message': '类型和内容不能为空'}), 400

        # 验证反馈类型
        if data['type'] not in ['bug', 'suggestion', 'complaint']:
            return jsonify({'success': False, 'message': '无效的反馈类型'}), 400

        # 验证内容长度
        content = data['content'].strip()
        if len(content) < 10 or len(content) > 500:
            return jsonify({'success': False, 'message': '内容需在10-500字之间'}), 400

        # 创建反馈记录
        new_feedback = Feedback(
            user_id=current_user.id,
            type=data['type'],
            content=content,
            contact_info=data.get('contact_info')
        )
        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '反馈提交成功'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# 在文档2的Flask应用中添加以下路由
@app.route('/api/clear_data', methods=['DELETE'])
@token_required
def clear_user_data(current_user):
    try:
        # 删除用户所有地址
        Address.query.filter_by(user_id=current_user.id).delete()

        # 删除用户所有订单
        Order.query.filter_by(user_id=current_user.id).delete()
        Good.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '用户数据已成功清除'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'清除数据时出错: {str(e)}'
        }), 500


# 在文档1的Flask应用中添加以下代码
# ==== 数据库模型（追加到原有模型） ====
class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    messages = db.relationship('ChatMessage', backref='session', lazy=True, cascade="all, delete-orphan")


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('chat_sessions.id'), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # user or assistant
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ==== 添加DeepSeek API配置 ====
# 密钥从环境变量读取，不要写进代码：
#   export DEEPSEEK_API_KEY="sk-..."
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")

# ==== 创建DeepSeek客户端 ====
deepseek_client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com/"
)


# ==== 修改后的DeepSeek API调用函数 ====
def call_deepseek_api(messages):
    """使用OpenAI SDK调用DeepSeek大模型API"""
    # 格式化消息
    formatted_messages = []
    for msg in messages:
        role = msg.role.lower()
        if role not in ["user", "assistant"]:
            role = "user"
        formatted_messages.append({
            "role": role,
            "content": msg.content
        })

    # 添加系统提示词
    formatted_messages.insert(0, {
        "role": "system",
        "content": "身份与使命：你是专为浙江大学学生量身定制的浙就来吃饭推荐小助手。核心使命是帮助浙大学子解决日常饮食决策难题，成为探索校园及周边美食的贴心伙伴。通过精准的个性化推荐和热情服务，为繁忙或选择困难的同学提供省心、美味、符合需求的用餐体验，营造愉悦的校园饮食文化氛围。\n\n核心能力与交互流程：\n1. 需求深度挖掘：主动引导多轮对话，收集用餐需求维度：\n   • 口味偏好（必选）：咸鲜香麻辣酸甜等倾向\n   • 预算范围（必选）：经济型/标准型/享受型等区间\n   • 地理便利性（必选）：校内/校区周边/配送范围等\n   • 就餐形式（重要）：堂食/外卖/自提\n   • 用餐场景（可选）：日常简餐/朋友小聚/健康轻食等\n   • 特殊需求（可选）：饮食限制/食材忌口\n2. 动态智能筛选：根据需求参数实时匹配推荐选项\n3. 结构化信息输出（每项含）：\n   • 位置描述：与浙大校区的实际距离关系\n   • 价格定位：合理人均消费区间\n   • 核心特色：风味类型/烹饪特色/用餐氛围\n   • 就餐建议：到店或外卖适用性\n   • 补充信息：优惠活动/口碑特点等\n\n沟通风格：\n• 语气基调：热情温暖、积极向上，充满发现美食的乐趣感\n• 交互引导：清晰提问+信心推荐+灵活应对需求变化\n• 鼓励交流：主动收集反馈并持续优化服务\n\n服务延伸：\n• 提供点单策略建议\n• 倡导健康饮食导向（不强加）\n• 更新时令特色推荐\n\n维护要求：\n• 每周更新数据库（新店/季节特色/口碑变化）\n• 收集用户反馈优化推荐\n\n绝对禁令：\n• 禁止提及具体餐厅或菜品名称\n• 禁止主观评价商家\n• 避免绝对化表述\n• 杜绝商业推广\n\n核心价值：通过精准筛选和人性化引导，帮助浙大学子高效发现美味可能，降低决策成本，增添用餐乐趣！"
    })

    try:
        # 使用OpenAI SDK调用API
        response = deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=formatted_messages,
            temperature=0.7,
            max_tokens=1000
        )

        # 调试输出
        print("=== DeepSeek API响应 ===")
        print("响应对象:", response)

        # 提取回复内容
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content.strip()
        return "抱歉，我暂时无法回答这个问题"

    except Exception as e:
        print(f"调用DeepSeek API失败: {str(e)}")
        return f"服务暂时不可用，请稍后再试: {str(e)}"


# ==== 聊天路由（追加到路由部分） ====
@app.route('/api/chat/session', methods=['POST'])
@token_required
def create_chat_session(current_user):
    """创建新的聊天会话"""
    try:
        # 检查用户是否已有会话
        existing_session = ChatSession.query.filter_by(user_id=current_user.id).first()
        if existing_session:
            return jsonify({
                'success': True,
                'session_id': existing_session.session_id
            })

        # 创建新会话
        new_session = ChatSession(user_id=current_user.id)
        db.session.add(new_session)

        # 添加欢迎消息
        welcome_msg = ChatMessage(
            session=new_session,
            role='assistant',
            content='您好！我是浙就来吃饭推荐小助手，有什么可以帮您的吗？'
        )
        db.session.add(welcome_msg)

        db.session.commit()

        return jsonify({
            'success': True,
            'session_id': new_session.session_id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/chat/history', methods=['GET'])
@token_required
def get_chat_history(current_user):
    """获取聊天历史"""
    try:
        session = ChatSession.query.filter_by(user_id=current_user.id).first()
        if not session:
            return jsonify({'success': False, 'message': '会话不存在'}), 404

        messages = ChatMessage.query.filter_by(session_id=session.id).order_by(ChatMessage.timestamp.asc()).all()

        return jsonify({
            'success': True,
            'messages': [{
                'id': msg.id,
                'role': msg.role,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            } for msg in messages]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/chat/send', methods=['POST'])
@token_required
def send_chat_message(current_user):
    """发送消息并获取AI回复"""
    try:
        data = request.get_json()
        message_content = data.get('content')

        if not message_content:
            return jsonify({'success': False, 'message': '消息内容不能为空'}), 400

        # 获取用户会话
        session = ChatSession.query.filter_by(user_id=current_user.id).first()
        if not session:
            # 如果没有会话，创建一个
            session = ChatSession(user_id=current_user.id)
            db.session.add(session)
            db.session.commit()

        # 保存用户消息
        user_message = ChatMessage(
            session_id=session.id,
            role='user',
            content=message_content
        )
        db.session.add(user_message)
        db.session.commit()  # 立即提交以确保消息ID生成

        # 获取最近的对话历史（最多10条）
        recent_messages = ChatMessage.query.filter_by(session_id=session.id).order_by(
            ChatMessage.timestamp.desc()).limit(10).all()
        recent_messages.reverse()  # 从旧到新排序

        # 调用DeepSeek API
        ai_response = call_deepseek_api(recent_messages)  # 修改这里

        # 保存AI回复
        ai_message = ChatMessage(
            session_id=session.id,
            role='assistant',
            content=ai_response
        )
        db.session.add(ai_message)
        db.session.commit()

        return jsonify({
            'success': True,
            'reply': ai_response,
            'message_id': ai_message.id
        })
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()  # 打印完整错误堆栈
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/chat/clear', methods=['DELETE'])
@token_required
def clear_chat_history(current_user):
    """清空聊天历史"""
    try:
        session = ChatSession.query.filter_by(user_id=current_user.id).first()
        if not session:
            return jsonify({'success': False, 'message': '会话不存在'}), 404

        # 删除所有关联消息
        ChatMessage.query.filter_by(session_id=session.id).delete()

        # 添加新的欢迎消息
        welcome_msg = ChatMessage(
            session=session,
            role='assistant',
            content='您好！我是浙就来吃饭推荐小助手，有什么可以帮您的吗？'
        )
        db.session.add(welcome_msg)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': '聊天记录已清空'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# 初始化数据库（确保创建新表）

# 初始化数据库
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    try:
        app.run(debug=True, port=5000)
    except Exception as e:
        print(f"程序运行时发生错误: {e}")