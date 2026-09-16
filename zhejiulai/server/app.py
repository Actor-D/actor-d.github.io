from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import json
import uuid
import re
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask_cors import CORS

import os
from werkzeug.utils import secure_filename
from flask import current_app
from flask import send_from_directory

UPLOAD_FOLDER = 'uploads'  # 确保创建这个目录
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# 初始化Flask应用
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zju_delivery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB限制

# 初始化数据库
db = SQLAlchemy(app)

# 允许跨域
CORS(app,
     resources={r'/*': {'origins': ["http://localhost:5173", "http://127.0.0.1:5000"], "supports_credentials": True}})

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
    notes = db.Column(db.Text,nullable=True)

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
    return jsonify({
        'success': True,
        'user': {
            'student_id': current_user.student_id,
            'name': current_user.name,
            'phone': current_user.phone,
            'identity': current_user.identity,
            'campus': current_user.campus,
            'points': current_user.points
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
# POINTS_EXCHANGE_RATE = 10

# @app.route('/api/order', methods=['GET'])
# @token_required
# def get_addresses(current_user):
#     addresses = Address.query.filter_by(user_id=current_user.id).all()
#     return jsonify([{
#         'id': addr.id,
#         'icon': addr.icon,
#         'title': addr.title,
#         'detail': addr.detail,
#         'time': addr.time,
#         'is_default': addr.is_default
#     } for addr in addresses])


@app.route('/api/order', methods=['POST'])
@token_required
def create_order(current_user):
    """处理页面1和页面2的数据提交"""
    data = request.get_json()
    # 根据是否加急计算两种配送费
    is_urgent = data.get('is_urgent', False)
    delivery_fee_cash = 7.0 if is_urgent else 5.0
    delivery_fee_points = 70 if is_urgent else 50  # 积分按1:10比例

    # 验证必要字段
    required_fields = ['food_name']
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
            is_urgent=data.get('is_urgent', False),
            notes=data.get('notes',''),
            delivery_fee_cash=delivery_fee_cash,
            delivery_fee_points=delivery_fee_points,
            # 初始化状态
            payment_status='draft'  # 草稿状态
        )
        db.session.add(new_order)
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
        db.session.commit()

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# @app.route('/api/order/<order_id>/payment', methods=['PUT'])
# @token_required
# def update_payment(current_user, order_id):
#     """处理页面3的支付方式选择"""
#     data = request.get_json()

#     try:
#         order = Order.query.filter_by(
#             order_id=order_id,
#             user_id=current_user.id
#         ).first_or_404()


#         # 更新支付信息
#         payment_method = data['payment_method']
#         order.payment_currency = 'points' if payment_method == 'points' else 'cash'
#         order.payment_method = data['payment_method']
#         order.delivery_fee = calculate_delivery_fee(order.is_urgent)  # 计算配送费
#         order.payment_status = 'pending_payment'
#         db.session.commit()


#         return jsonify({
#             'success': True,
#             'delivery_fee': order.delivery_fee,
#             'next_step': '/Pay',
#             'delivery_fee': order.delivery_fee_points if order.payment_currency == 'points'
#                        else order.delivery_fee_cash,
#             'currency_type': order.payment_currency

#         })

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'success': False, 'message': str(e)}), 400


@app.route('/api/order', methods=['GET'])
@token_required
def get_orders(current_user):
    """订单列表"""
    orders = Order.query.filter_by(user_id=current_user.id) \
        .order_by(Order.created_at.desc()) \
        .all()

    return jsonify({
        'success': True,
        'orders': [{
            'id': o.order_id,
            'food_name': o.food_name,
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
        'food_name': order.food_name,
        'order_id': order.order_id,
        'paymentMethod': order.payment_method,
        'locker_info': order.locker_info,
        'notes': order.notes,
        'created_at': order.created_at.isoformat(),
        'receiver_address': order.receiver_address,
        'amount': order.payment_amount,
        'delivery_address': order.delivery_address,
        'is_urgent': order.is_urgent,
        'status': order.payment_status
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


# 辅助函数
# def calculate_delivery_fee(is_urgent=False):
#     """返回包含现金和积分两种费用的字典"""
#     cash_fee = 7.0 if is_urgent else 5.0
#     points_fee = int(cash_fee * POINTS_EXCHANGE_RATE)  # 70/50积分
#     return {
#         'cash': cash_fee,
#         'points': points_fee
#     }

# def calculate_total_amount(order):
#     """根据支付方式计算总金额"""
#     if order.payment_currency == 'points':
#         return order.delivery_fee_points  # 返回积分总数
#     else:
#         base_fee = order.delivery_fee_cash
#         # 可扩展其他现金费用（如包装费）
#         return base_fee

# 初始化数据库
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)