<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import axios from 'axios';

const newOrder = ref({ delivery_address: "", receiver_address: "" });
const addressOptions = ref([]);
const isDropdownVisible = ref(false);
const searchTerm = ref(""); // 用于搜索地址
const filteredAddresses = computed(() => {
  return addressOptions.value.filter(addr =>
    addr.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    addr.detail.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchOrder = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/order', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    newOrder.value = response.data;
  } catch (error) {
    console.error('Error fetching order', error);
  }
};

const submitAddress = async () => {
  try {
    // 1. 检查必填字段
    if (!newOrder.value.delivery_address?.trim()) {
      throw new Error('请填写配送地址！');
    }

    // 2. 获取订单ID和token
    const orderId = sessionStorage.getItem('current_order_id');
    if (!orderId) {
      throw new Error('找不到订单ID');
    }

    const token = sessionStorage.getItem('token');

    // 3. 打印调试信息
    console.log('提交的数据:', {
      delivery_address: newOrder.value.delivery_address,
      receiver_address: newOrder.value.receiver_address
    });

    // 4. 发送请求
    const response = await axios.post(
      `http://127.0.0.1:5000/api/order/${orderId}/address`,
      {
        delivery_address: newOrder.value.delivery_address.trim(),
        receiver_address: newOrder.value.receiver_address?.trim() || '',
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 5. 成功后跳转
    if (response.data.success) {
      router.push('/Home/CreateOrder/Complete');
    }
  } catch (error) {
    console.error('提交失败详情:', {
      error: error.message,
      response: error.response?.data
    });
    alert(`提交失败: ${error.response?.data?.message || error.message}`);
  }
};

const loadAddresses = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    addressOptions.value = response.data;
  } catch (error) {
    console.error('加载地址失败:', error);
  }
};

const handleAddressSelect = (address) => {
  newOrder.value.receiver_address = `${address.title} - ${address.detail}`;
  isDropdownVisible.value = false;
  searchTerm.value = `${address.title} - ${address.detail}`;
};

// 页面加载时获取地址
onMounted(() => {
  loadAddresses();
  fetchOrder();
});
</script>

<template>
  <!-- navigation -->
  <div class="step-container">
    <div class="step">
      <div class="step-icon">🛒</div>
      <div class="step-text">填写信息</div>
    </div>
    <div class="step">
      <div class="step-icon active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="step-text done">选择地址</div>
    </div>
    <div class="step">
      <div class="step-icon">✓</div>
      <div class="step-text">确认订单</div>
    </div>
    <div class="step">
      <div class="step-icon">✓</div>
      <div class="step-text">支付完成</div>
    </div>
  </div>

  <div class="order-container">
    <div class="order-content">
      <h2>填写地址信息</h2>
      <div class="information">
        <div class="image-input">
          <img src="../../../../public/images/zjg-map.jpg" class="map-image" />
        </div>
        <div class="input-group">
          <label for="food-name">外卖地址：</label>
          <input
            type="text"
            id="food-name"
            v-model="newOrder.delivery_address"
            placeholder="请输入您的外卖地址信息"
            class="food-input"
          />

          <!-- 接收地址（带下拉选择） -->
          <label for="food-address" class="food-address">收货地址：</label>
          <div class="custom-select-container">
            <input
              type="text"
              id="food-address"
              v-model="searchTerm"
              @focus="isDropdownVisible = true"
              @blur="isDropdownVisible = false"
              @input="searchTerm = $event.target.value"
              placeholder="选择或输入收货地址"
              class="food-input"
            />
            <div
              class="dropdown-list"
              v-if="isDropdownVisible && filteredAddresses.length > 0"
            >
              <div
                v-for="addr in filteredAddresses"
                :key="addr.id"
                class="dropdown-item"
                @click="handleAddressSelect(addr)"
              >
                <span>{{ addr.title }}</span>
                <span>{{ addr.detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-content">
      <button class="order-button1">
        <router-link to="/Home/CreateOrder/Info" class="nav-link">上一步</router-link>
      </button>
      <button class="order-button2" @click="submitAddress">
        下一步
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Element Plus 选择器样式覆盖 */
/* 标签样式保持原有风格 */
/* Element Plus 选择器样式覆盖 */
/* 更精确的下拉箭头控制 */

/* 悬停和聚焦状态 */

/* 展开状态 */
h2 {
  padding-left: 12px;
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.image-input {
  flex: 1;
  padding: 12px;
  display: flex;
  justify-content: center;
}

.map-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  flex: 1;
  padding: 0 20px;
  margin-top: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.food-input {
  width: 100%;
  padding: 12px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.food-address {
  margin-top: 25px;
}

.food-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.food-input::placeholder {
  color: #999;
}

.order-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}

.order-content {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px 0;
}

.information {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
}

.button-content {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
  gap: 15px;
}

button {
  padding: 10px 20px;
  border: 2px solid #007bff;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s;
}

button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.nav-link {
  color: white;
  text-decoration: none;
}

/* 下拉选择器样式 */
.custom-select-container {
  position: relative;
  width: 100%;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item span:first-child {
  font-weight: bold;
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
</style>