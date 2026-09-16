<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const orders = ref([]);
const isLoading = ref(true);

const getFullImageUrl = (url) => {
  return url ? `http://127.0.0.1:5000${url}` : '../../../../public/images/order-empty.jpg';
};

const fetchAllOrders = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const [foodOrdersRes, goodOrdersRes] = await Promise.all([
      axios.get('http://127.0.0.1:5000/api/order', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get('http://127.0.0.1:5000/api/good', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const foodOrders = foodOrdersRes.data.orders.map(order => ({
      id: order.id,
      type: 'food',
      status: order.status,
      statusText: order.status === 'preparing' ? '准备中' :
                order.status === 'delivering' ? '配送中' : '已完成',
      GoodsAdress: order.delivery_address || '智能外卖柜',
      orderTime: new Date(order.created_at).getTime(),
      displayTime: new Date(order.created_at).toLocaleString(),
      items: [{
        id: 1,
        name: order.food_name || '外卖订单',
        price: order.payment_method === 'points' ? '0积分' : '¥0',
        image: getFullImageUrl(order['image-url']),
        type: 'food'
      }],
      total: order.payment_method === 'points'
        ? `${order.payment_amount}积分`
        : `¥${order.payment_amount}`,
      paymentMethod: order.payment_method === 'points' ? '积分支付' : '现金支付',
      isUrgent: order.is_urgent
    }));

    const goodOrders = goodOrdersRes.data.orders.map(order => ({
      id: order.id,
      type: 'good',
      status: order.status,
      statusText: order.status === 'preparing' ? '准备中' :
                order.status === 'delivering' ? '配送中' : '已完成',
      GoodsAdress: order.delivery_address || '物品配送',
      orderTime: new Date(order.created_at).getTime(),
      displayTime: new Date(order.created_at).toLocaleString(),
      items: [{
        id: 1,
        name: `${order.good_name} (${order.good_type}, ${order.good_size})`,
        price: order.payment_method === 'points' ? '0积分' : '¥0',
        image: getFullImageUrl(order['image-url']),
        type: 'good'
      }],
      total: order.payment_method === 'points'
        ? `${order.payment_amount}积分`
        : `¥${order.payment_amount}`,
      paymentMethod: order.payment_method === 'points' ? '积分支付' : '现金支付',
      isUrgent: order.is_urgent
    }));

    orders.value = [...foodOrders, ...goodOrders]
      .sort((a, b) => b.orderTime - a.orderTime)
      .map(order => ({
        ...order,
        orderTime: order.displayTime
      }));

  } catch (error) {
    console.error('获取订单列表失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const viewDetail = (orderId, orderType) => {
  router.push({
    path: orderType === 'food'
      ? '/Home/ViewOrder/ListDetail'
      : '/Home/ViewOrder/GoodDetail',
    query: { orderId }
  });
};

const reorder = (orderType) => {
  router.push(orderType === 'food'
    ? '/Home/CreateOrder/Info'
    : '/Home/CreateOrder/Good'
  );
};

onMounted(fetchAllOrders);
</script>

<template>
  <div class="order-list-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      加载中...
    </div>

    <!-- 无订单提示 -->
    <div v-else-if="orders.length === 0" class="empty-orders">
      <img src="../../../../public/images/order-empty.jpg" alt="无订单">
      <p>暂无订单记录</p>
    </div>

    <!-- 订单列表 -->
    <div v-else class="order-list">
      <!-- 单个订单卡片 -->
      <div v-for="order in orders" :key="order.id" class="order-card">
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="shop-info">
            <h3>{{ order.GoodsAdress }}</h3>
            <span v-if="order.isUrgent" class="urgent-tag">加急</span>
            <span class="order-status" :class="order.status">{{ order.statusText }}</span>
            <span class="order-type">{{ order.type === 'food' ? '外卖' : '物品配送' }}</span>
          </div>
          <div class="order-time">{{ order.orderTime }}</div>
        </div>

        <!-- 商品列表 -->
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <a-image :width="80" :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-price">{{ order.total }}</p>
            </div>
          </div>
        </div>

        <!-- 订单底部 -->
        <div class="order-footer">
          <div class="order-total">
            实付款：<span class="total-price">{{ order.total }}</span>
            <span v-if="order.isUrgent" class="urgent-fee">(含加急费)</span>
          </div>
          <div class="order-actions">
            <button @click="viewDetail(order.id, order.type)" class="action-btn detail-btn">订单详情</button>
            <button @click="reorder(order.type)" class="action-btn reorder-btn">再来一单</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-space"></div>
  </div>
</template>

<style scoped>
.footer-space {
  height: 100px; /* 设置高度 */
  background-color: #f5f5f5; /* 设置背景颜色 */
}
.order-type {
  margin-left: 8px;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}
.order-list-container {
  width: 100%;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.order-status {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-items {
  padding: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.order-item:not(:last-child) {
  border-bottom: 1px dashed #f0f0f0;
}

.item-image {
  width: 5%;
  height: 5%;
  border-radius: 8px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
  font-weight: normal;
}

.item-price {
  margin: 5px 0 0;
  font-size: 14px;
  color: #FF5722;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #f5f5f5;
  background: #fafafa;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 18px;
  color: #FF5722;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.detail-btn {
  background: white;
  color: #666;
  border-color: #ddd;
}

.detail-btn:hover {
  background: #f5f5f5;
}

.reorder-btn {
  background: #007bff;
  color: white;
}

.reorder-btn:hover {
  background: #007bff;
}
</style>