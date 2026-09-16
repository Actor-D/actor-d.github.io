<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const orderInfo = ref({
  orderId: '',
  food_name: '',
  locker_info: '',
  deliveryFees: '',
  paymentMethod: '',
  paymentTime: ''
});

const fetchOrder = async () => {
  try {
    const orderId = sessionStorage.getItem('current_order_id');
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`http://127.0.0.1:5000/api/order/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const orderData = response.data.order || response.data;
    const isPointsPayment = orderData.payment_method === 'points';

    orderInfo.value = {
      orderId: orderData.id,
      food_name: orderData.food_name || '未知',
      locker_info: orderData.locker_info || '未提供',
      paymentMethod: isPointsPayment ? '积分支付' : '现金支付',
      deliveryFees: isPointsPayment
        ? `${orderData.delivery_fee_points || 0}积分`
        : `¥${(orderData.delivery_fee_cash || 0).toFixed(2)}`,
      paymentTime: new Date(orderData.created_at).toLocaleString()
    };
  } catch (error) {
    console.error('获取订单失败:', error);
  }
};

const viewOrder = () => {
  router.push({
    path: '/Home/ViewOrder/ListDetail',
    query: { orderId: orderInfo.value.orderId }
  });
};

onMounted(fetchOrder);
</script>

<template>
  <!-- navigation -->
  <div class="step-container">
    <div class="step">
      <div class="step-icon">🛒</div>
      <div class="step-text">填写信息</div>
    </div>
    <div class="step">
      <div class="step-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="step-text">选择地址</div>
    </div>
    <div class="step">
      <div class="step-icon">✓</div>
      <div class="step-text">确认订单</div>
    </div>
    <div class="step">
      <div class="step-icon active">✓</div>
      <div class="step-text done">支付完成</div>
    </div>
  </div>

  <div class="payment-complete-container">
    <!-- 支付成功图标 -->
    <div class="success-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>

    <!-- 支付成功标题 -->
    <h1 class="success-title">支付成功</h1>
    <p class="success-subtitle">感谢您的购买</p>

    <!-- 订单信息卡片 -->
    <div class="order-card">
      <div class="order-info-item">
        <span>订单编号：</span>
        <strong>{{ orderInfo.orderId }}</strong>
      </div>
      <div class="order-info-item">
        <span>支付方式：</span>
        <strong>{{ orderInfo.paymentMethod }}</strong>
      </div>
      <div class="order-info-item">
        <span>支付金额：</span>
        <strong class="amount">{{ orderInfo.deliveryFees }}</strong>
      </div>
      <div class="order-info-item">
        <span>支付时间：</span>
        <strong>{{ orderInfo.paymentTime }}</strong>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="home-button pulse"><router-link to="/Home" class="nav-link">返回首页</router-link></button>
      <button class="home-button pulse" @click="viewOrder">查看订单</button>
    </div>

    <!-- 额外提示 -->
    <p class="extra-tips">
      如有任何问题，请联系客服：400-123-4567
    </p>
  </div>
</template>

<style scoped>
.payment-complete-container {
  margin: 0 auto;
  padding: 20px 20px;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  opacity: 0;
  animation: fade-in 0.5s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.success-icon {
  margin: 20px auto;
  animation: bounce 0.6s, pulse 2s infinite 1s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-20px);}
  60% {transform: translateY(-10px);}
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.success-title {
  font-size: 28px;
  color: #515355;
  margin-bottom: 10px;
}

.success-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.order-card {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
  text-align: left;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.order-info-item {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  font-size: 15px;
  transition: all 0.3s;
}

.order-info-item:hover {
  transform: scale(1.02);
}

.order-info-item span {
  color: #666;
}

.amount {
  color: #FF5722;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

button {
  padding: 12px 25px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.home-button {
  background: #007bff;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
}

.home-button:hover {
  background: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}

.home-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.home-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

.extra-tips {
  font-size: 14px;
  color: #999;
  margin-top: 40px;
}

/* 底部按钮 */
button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  border: 2px solid #007bff;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.nav-link {
  color: white;
  text-decoration: none;
}

/* 导航栏 */
.step-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 50px auto 15px auto;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin:20px 0 0 0;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.step-icon:hover {
  transform: scale(1.1);
}

.step-icon.active {
  background-color: #007bff;
  color: white;
  animation: pulse 2s infinite;
}

.step-icon.done {
  background-color: #e0e0e0;
}

.step-text {
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.step-text:hover {
  color: #333;
}

.step-text.active {
  color: #333;
}

.step-text.done {
  color: #007bff;
}

/* 添加线和小圆点 */
.step-container::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ccc;
  z-index: -1;
}

.step::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background-color: #ccc;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s;
}

.step.active::before {
  background-color: #007bff;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: all 0.3s ease;
}

.scale-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
</style>