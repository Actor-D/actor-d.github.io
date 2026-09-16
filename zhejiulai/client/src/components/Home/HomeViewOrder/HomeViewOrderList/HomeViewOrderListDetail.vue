<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// 订单数据
const order = ref({
  id: route.query.orderId || '', // 从路由参数获取orderId
  status_deliver: 'delivering', // preparing/delivering/completed
  statusText: '',
  locker_info: '',
  orderTime: '',
  deliveryAddress: '浙江大学紫金港校区西教智能柜',
  deliveryPerson: '王师傅',
  deliveryPhone: '138****1234',
  items: [],
  deliveryFee: 0,
  total: 0,
  paymentMethod: '',
});

// 动画状态
const animated = ref(false);

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`http://127.0.0.1:5000/api/order/${order.value.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = response.data.order; // 注意这里获取order对象

    // 修正1：统一使用data.status进行状态判断
    let status_deliver, statusText;
    switch(data.status) {
      case 'paid':
        status_deliver = 'preparing';
        statusText = '商家备餐中';
        break;
      case 'delivering':
        status_deliver = 'delivering';
        statusText = '骑手派送中';
        break;
      case 'completed':
        status_deliver = 'completed';
        statusText = '订单已完成';
        break;
      default:
        status_deliver = data.status;
        statusText = '订单已创建';
    }

    // 修正2：使用正确的支付方式判断
    const isPointsPayment = data.payment_method === 'points';

    order.value = {
      ...order.value,
      id: data.id,
      status: status_deliver, // 保持一致性
      status_deliver,
      statusText,
      deliveryAddress: data.delivery_address,
      receiver_address: data.receiver_address,
      orderTime: new Date(data.created_at).toLocaleString(),
      items: [{
        id: data.id,
        name: data.food_name,
        price: 0, // 如果没有价格数据可以设为0
        size: data.size // 添加商品规格
      }],
      // 修正3：统一使用payment_method判断
      deliveryFee: isPointsPayment ? data.delivery_fee_points : data.delivery_fee_cash,
      total: isPointsPayment
          ? `${data.delivery_fee_points}积分`
          : `¥${data.delivery_fee_cash.toFixed(2)}`,
      paymentMethod: isPointsPayment ? '积分支付' : '现金支付'
    };

    await fetchOrderImages();
  } catch (error) {
    console.error('获取订单详情失败:', error);
  }
};
const orderImages = ref([]); // 存储图片路径数组
const defaultImage = '../../../../../public/images/order-empty.jpg';

// 获取订单图片
const fetchOrderImages = async () => {
  if (!order.value.id) return;

  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(
        `http://127.0.0.1:5000/api/orders/${order.value.id}/images`,
        {
          headers: {'Authorization': `Bearer ${token}`}
        }
    );

    // 处理返回的图片路径
    if (response.data.images && response.data.images.length > 0) {
      // 转换为完整URL（注意端口要与后端一致）
      orderImages.value = response.data.images.map(img =>
          img ? `http://127.0.0.1:5000${img}` : defaultImage
      );
    } else {
      // 如果没有图片，使用默认图片
      orderImages.value = [defaultImage];
    }

  } catch (error) {
    console.error('获取图片失败:', error);
    orderImages.value = [];
  }
};


// 联系骑手
const contactDelivery = () => {
  console.log('联系骑手:', order.value.deliveryPhone);
  // 添加点击动画
  const btn = document.querySelector('.contact-btn');
  btn.classList.add('clicked');
  setTimeout(() => {
    btn.classList.remove('clicked');
  }, 300);
};

// 根据状态获取状态样式
const getStatusClass = (status) => {
  const statusClasses = {
    preparing: 'status-preparing',
    delivering: 'status-delivering',
    completed: 'status-completed'
  };
  return statusClasses[status] || '';
};

const handleImageError = (e) => {
  e.target.src = '../../../../../public/images/order-empty.jpg';
};

onMounted(() => {
  fetchOrderDetail();
  setTimeout(() => {
    animated.value = true;
  }, 100);
});

</script>

<template>
  <div class="order-detail-container" :class="{ 'animated': animated }">
    <!-- 订单状态卡片 -->
    <transition name="slide-fade">
      <div class="status-card" :class="getStatusClass(order.status)">
        <div class="status-icon">
          <svg v-if="order.status === 'preparing'" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4m0 12v4M5 12H2m20 0h-3m-2.5-6.5L19 5m-14 14 2.5-2.5"></path>
          </svg>
          <svg v-else-if="order.status === 'delivering'" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="status-info">
          <h2>{{ order.statusText }}</h2>
          <p v-if="order.status === 'preparing'">等待骑手接单</p>
          <p v-else-if="order.status === 'delivering'">预计很快送达</p>
          <p v-else>订单已完成</p>
        </div>
      </div>
    </transition>

    <!-- 配送信息 -->
    <transition name="slide-fade" appear>
      <div class="delivery-card">
        <div class="delivery-person">
          <div class="avatar">骑</div>
          <div class="info">
            <h3>{{ order.deliveryPerson }} <span>正在配送</span></h3>
            <p>{{ order.deliveryPhone }}</p>
          </div>
          <router-link to="/Home/MessagePageList" @click="contactDelivery" class="contact-btn">联系骑手（可以跳转，但无功能）</router-link>
        </div>
        <div class="delivery-address">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>{{ order.locker_info || order.deliveryAddress }}</p>
        </div>
      </div>
    </transition>

    <!-- 订单商品列表 -->
    <transition name="slide-fade" appear>
      <div class="items-card">
        <h3 class="card-title">订单商品</h3>
        <div class="item-list">
          <div v-for="item in order.items" :key="item.id" class="item">
            <div class="image-gallery">
              <div v-for="(img, index) in orderImages" :key="index">
                <img :src="img" :alt="`订单图片-${index}`" class="preview-image">
              </div>
            </div>
            <div class="item-info">
              <div class="info-row">
                <!-- <span class="info-label">订单名称</span> -->
                <span class="info-value">订单名称：{{ item.name }}</span>
              </div>
              <div class="info-row price-row">
                <span>商品价格</span>
                <span class="price-value">{{ order.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 订单信息 -->
    <transition name="slide-fade" appear>
      <div class="order-info-card">
        <h3 class="card-title">订单信息</h3>
        <div class="info-row">
          <span>订单编号</span>
          <span>{{ order.id }}</span>
        </div>
        <div class="info-row">
          <span>下单时间</span>
          <span>{{ order.orderTime }}</span>
        </div>
        <div class="info-row">
          <span>支付方式</span>
          <span>{{ order.paymentMethod }}</span>
        </div>
        <div class="info-row">
          <span>取餐地址</span>
          <span>{{ order.locker_info || order.deliveryAddress }}</span>
        </div>
      </div>
    </transition>

    <!-- 价格明细 -->
    <transition name="slide-fade" appear>
      <div class="price-card">
        <h3 class="card-title">价格明细</h3>
        <div class="price-row">
          <span>商品总价</span>
          <span>0</span>
        </div>
        <div class="price-row">
          <span>配送费</span>
          <span>{{ order.paymentMethod === '积分支付' ? order.deliveryFee + '积分' : '¥' + order.deliveryFee }}</span>
        </div>
        <div class="price-row total">
          <span>实付款</span>
          <span class="total-price">{{ order.total }}</span>
        </div>
      </div>
    </transition>

    <div class="button-content">
      <button class="btn-home">
        <router-link to="/Home" class="nav-link">返回首页</router-link>
      </button>
      <button class="btn-reorder">
        <router-link to="/Home/CreateOrder/Info" class="nav-link">再来一单</router-link>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 基础动画效果 */
.preview-image {
  width: 200px; /* 设置图片宽度 */
  height: auto; /* 高度自动调整以保持宽高比 */
  object-fit: cover; /* 确保图片覆盖整个容器 */
  border-radius: 4px; /* 可选：给图片添加圆角 */
}

/* 状态卡片动画 */
.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  color: #3a84a6;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-icon {
  margin-right: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.status-info h2 {
  margin: 0;
  font-size: 20px;
}

.status-info p {
  margin: 5px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 配送卡片 */
.delivery-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.delivery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.delivery-person {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #2196F3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.info h3 {
  margin: 0;
  font-size: 16px;
}

.info h3 span {
  font-size: 12px;
  background: #E3F2FD;
  color: #1976D2;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  animation: blink 2s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

.info p {
  margin: 3px 0 0;
  font-size: 14px;
  color: #666;
}

.contact-btn {
  margin-left: auto;
  background: none;
  border: 1px solid #2196F3;
  color: #2196F3;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 13px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-btn:hover {
  background: #2196F3;
  color: white;
}

.delivery-address {
  display: flex;
  align-items: flex-start;
}

.delivery-address svg {
  margin-right: 10px;
  color: #2196F3;
  flex-shrink: 0;
}

.delivery-address p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

/* 商品列表 */
.card-title {
  margin: 0 0 15px;
  font-size: 16px;
  color: #333;
  position: relative;
  padding-bottom: 5px;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #2196F3;
}

.items-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateX(5px);
}

.item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.item-image:hover {
  transform: scale(1.05);
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0;
  font-size: 15px;
  font-weight: normal;
}

.price {
  margin: 5px 0 0;
  color: #FF5722;
  font-size: 14px;
}

/* 订单信息 */
.order-info-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.info-row:hover {
  color: #2196F3;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row span:first-child {
  color: #666;
}


.item-info {
  flex: 1;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  line-height: 1.4;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 200; /* 减少标签和值之间的间距 */
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 300;
}

.price-row {
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid #f0f0f0;
}

.price-value {
  font-size: 15px;
  /* font-weight: 600; */
  color: #ff5722;
  background: #fff0ee;
  padding: 2px 8px;
  border-radius: 10px;
  /* display: inline-block; */
}

/* 微调悬停效果 */
.info-row:hover .info-value {
  color: #2196F3;
}


/* 价格明细 */
.price-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.price-row:last-child {
  margin-bottom: 0;
}

.discount {
  color: #4CAF50;
}

.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  font-weight: bold;
}

.total-price {
  color: #FF5722;
  font-size: 16px;
  font-weight: bold;
}

/* 操作按钮 */
.button-content {
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  margin-top: 10px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-home {
  border: 2px solid #607D8B;
  background-color: #607D8B;
  color: white;
}

.btn-home:hover {
  background-color: #455A64;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-reorder {
  border: 2px solid #2196F3;
  background-color: #2196F3;
  color: white;
}

.btn-reorder:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
}

/* 页面加载动画 */
.order-detail-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.order-detail-container.animated {
  opacity: 1;
  transform: translateY(0);
}
</style>