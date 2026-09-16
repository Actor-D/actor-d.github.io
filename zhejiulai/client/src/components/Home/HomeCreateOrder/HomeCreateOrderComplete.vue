<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const showInsufficientPoints = ref(false);
const showPaymentError = ref(false);
const userInfo = ref({
  name: '',
  student_id: '',
  phone: '',
  points: 0
});
const orderInfo = ref({
  food_name: '',
  locker_info: '',
  delivery_fee_cash: 5.0,
  delivery_fee_points: 0,
  size: '',
  distance: 0,
  urgent: false
});
const paymentMethods = ref([
  { id: 1, name: '微信支付', checked: false, type: 'money' },
  { id: 2, name: '支付宝支付', checked: false, type: 'money' },
  { id: 3, name: '积分支付', checked: false, type: 'points' }
]);
const hoverPayment = ref(null);
const errorMessage = ref('');
const orderId = ref(sessionStorage.getItem('current_order_id'));

const selectedPayment = computed(() =>
  paymentMethods.value.find(method => method.checked)
);

const totalDisplay = computed(() => {
  if (!selectedPayment.value) return '¥0.00';
  return selectedPayment.value.type === 'points'
    ? `${orderInfo.value.delivery_fee_points}积分`
    : `¥${orderInfo.value.delivery_fee_cash.toFixed(2)}`;
});

const canUsePoints = computed(() =>
  userInfo.value.points >= orderInfo.value.delivery_fee_points
);

const fetchUserProfile = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/user_profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.data.success) {
      userInfo.value = response.data.user;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

const fetchOrder = async () => {
  try {
    if (!orderId.value) {
      errorMessage.value = '订单ID不存在，请返回重试';
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      errorMessage.value = '用户未登录，请登录后重试';
      return;
    }

    const response = await axios.get(`http://127.0.0.1:5000/api/order/${orderId.value}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data.success) {
      const orderData = response.data.order;
      orderInfo.value = {
        orderId: orderData.order_id,
        food_name: orderData.food_name || '未知',
        locker_info: orderData.locker_info || '未提供',
        delivery_fee_cash: orderData.delivery_fee_cash || 5.0,
        delivery_fee_points: orderData.delivery_fee_points || 0,
        size: orderData.size || '',
        distance: orderData.distance || 0,
        urgent: orderData.urgent || false,
        receiver_address: orderData.receiver_address || '未填写',
        delivery_address: orderData.delivery_address || '未填写'
      };
    } else {
      errorMessage.value = '获取订单信息失败，请返回重试';
    }
  } catch (error) {
    errorMessage.value = `获取订单信息失败: ${error.response?.data?.message || '服务器错误'}`;
  }
};

const selectPayment = (selectedId) => {
  if (selectedId === 3 && !canUsePoints.value) {
    showInsufficientPoints.value = true;
    setTimeout(() => showInsufficientPoints.value = false, 3000);
    return;
  }
  paymentMethods.value.forEach(method => {
    method.checked = method.id === selectedId;
  });
};

const submitPayment = async () => {
  if (!selectedPayment.value) {
    showPaymentError.value = true;
    setTimeout(() => showPaymentError.value = false, 3000);
    return;
  }

  if (selectedPayment.value.type === 'points' && !canUsePoints.value) {
    showInsufficientPoints.value = true;
    setTimeout(() => showInsufficientPoints.value = false, 3000);
    return;
  }

  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.put(
      `http://127.0.0.1:5000/api/order/${orderId.value}/payment`,
      { payment_method: selectedPayment.value.type === 'points' ? 'points' : 'cash' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      router.push('/Home/CreateOrder/Pay');
    }
  } catch (error) {
    errorMessage.value = `支付失败: ${error.response?.data?.message || '服务器错误'}`;
  }
};

onMounted(() => {
  fetchUserProfile();
  fetchOrder();
});
</script>

<template>
  <!-- 步骤指示器 -->
  <div class="step-container">
    <div class="step">
      <div class="step-icon">🛒</div>
      <div class="step-text">填写信息</div>
    </div>
    <div class="step">
      <div class="step-icon done">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="step-text">选择地址</div>
    </div>
    <div class="step">
      <div class="step-icon active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="step-text done">确认订单</div>
    </div>
    <div class="step">
      <div class="step-icon">✓</div>
      <div class="step-text">支付完成</div>
    </div>
  </div>



  <div class="order-container">
    <!-- 订单信息部分 -->
    <div class="order-content height1">
      <div class="information">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </span>
        <div class="input-group">
          <div class="order-label">{{ orderInfo.receiver_address || '未提供' }}</div>
          <div class="order-label">{{ userInfo.name }} <span class="number">{{ userInfo.phone }}</span></div>
        </div>
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="order-content height2">
      <h2>订单明细</h2>
      <div class="order-label">
        {{ orderInfo.food_name }}
        <span class="payamount">¥0.00</span>
      </div>
      <div class="order-label">
        配送费
        <span class="payamount">
          ¥{{ orderInfo.delivery_fee_cash.toFixed(2) }} / {{ orderInfo.delivery_fee_points }}积分
        </span>
      </div>
    </div>

    <!-- 支付方式选择 -->
    <div class="order-content height3">
      <h2>支付方式：</h2>
      <div class="payment-options">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="circle-checkbox"
          @click="selectPayment(method.id)"
          @mouseenter="hoverPayment = method.id"
          @mouseleave="hoverPayment = null"
          :class="{ 'disabled': method.type === 'points' && !canUsePoints }"
        >
          <div class="circle-outer" :class="{
            checked: method.checked,
            hover: hoverPayment === method.id && !method.checked
          }">
            <div class="circle-inner"></div>
          </div>
          <span class="label">{{ method.name }}</span>
          <span class="payment-icon" v-if="method.id === 1">💳</span>
          <span class="payment-icon" v-if="method.id === 2">💰</span>
          <span class="payment-icon" v-if="method.id === 3">⭐</span>
        </div>
      </div>
    </div>

    <!-- 总计和支付按钮 -->
    <div class="order-content height4">
      <div class="information1">
        <h2 class="pay">总计：<span class="pay-label">{{ totalDisplay }}</span></h2>
        <button class="button-content" @click="submitPayment">
          确认支付
          <span class="button-icon">→</span>
        </button>
      </div>
    </div>

    <!-- 上一步按钮 -->
    <button class="button-content back-button">
      <router-link to="/Home/CreateOrder/Address" class="nav-link">上一步</router-link>
    </button>
  </div>
</template>

<style scoped>
/* 积分不足提示样式 */
.insufficient-points-alert, .payment-error-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: fadeInDown 0.5s;
}

.alert-content {
  background-color: #fff6f6;
  color: #f56c6c;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  border: 1px solid #fde2e2;
}

.alert-icon {
  margin-right: 8px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 禁用状态 */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 基础样式保持不变 */
.pay {
  margin-top: 25px;
}

/* 支付圆框样式 - 增强交互效果 */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.circle-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.circle-checkbox:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.circle-outer {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.circle-outer.checked {
  border-color: #007bff;
}

.circle-outer.hover {
  border-color: #007bff;
  transform: scale(1.1);
}

.circle-inner {
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s ease;
}

.circle-outer.checked .circle-inner {
  width: 10px;
  height: 10px;
  background-color: #007bff;
}

.label {
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.circle-checkbox:hover .label {
  color: #007bff;
}

.payment-icon {
  position: absolute;
  right: 15px;
  font-size: 16px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.circle-checkbox:hover .payment-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* 正文样式增强 */
.pay-label {
  font-size: 17px;
  color: #007bff;
  margin-left: 10px;
  font-weight: bold;
}

.order-label {
  font-size: 17px;
  color: #333;
  margin-left: 10px;
  margin-top: 20px;
  padding-left: 12px;
  transition: all 0.3s ease;
}

.order-label:hover {
  color: #007bff;
}

.payamount {
  color: black;
  position: absolute;
  right: 12px;
  transition: all 0.3s ease;
}

.order-label:hover .payamount {
  transform: translateX(-5px);
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 12px;
  width: 40px;
  height: 2px;
  background-color: #007bff;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.order-content:hover h2::after {
  transform: scaleX(1);
}

.input-group {
  margin-bottom: 20px;
  margin-left: 20px;
  margin-top: 5px;
}

.information {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.information1 {
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.order-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  position: relative;
  min-height: 400px;
}

.order-content {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.order-content:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.height1 {
  height: 110px;
}

.height2 {
  height: 140px;
}

.height3 {
  height: auto;
}

.height4 {
  height: 70px;
}

/* 按钮样式增强 */
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

button:hover {
  background-color: #0069d9;
  border-color: #0062cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-content {
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  margin-top: 10px;
}

.back-button {
  background-color: #007bff;
  color: #007bff;
}

.back-button:hover {
  background-color: #f8e1ec;
}

.button-icon {
  margin-left: 8px;
  transition: all 0.3s ease;
}

.button-content:hover .button-icon {
  transform: translateX(3px);
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

/* 导航栏动画 */
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
  margin: 20px 0 0 0;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.step:hover .step-icon:not(.active) {
  transform: scale(1.1);
  background-color: #d0d0d0;
}

.step-icon.active {
  background-color: #007bff;
  color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

.step-icon.done {
  background-color: #e0e0e0;
}

.step-text {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.step:hover .step-text {
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
  top: 0;
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
  transition: all 0.3s ease;
}

.step:hover::before {
  background-color: #aaa;
}

.step.active::before {
  background-color: #007bff;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 25px 0 0 0;
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>