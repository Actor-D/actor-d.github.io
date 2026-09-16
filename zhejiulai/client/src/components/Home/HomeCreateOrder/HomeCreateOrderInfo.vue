<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const uploadedImage = ref(null);
const isUrgentDelivery = ref(false);
const size = ref('medium');
const newOrder = ref({
  food_name: "",
  locker_info: "",
  notes: "",
  is_urgent: false,
  size: ""
});
const errorMessage = ref('');
const isDragging = ref(false);

const fetchOrder = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/order', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    newOrder.value = response.data;
  } catch (error) {
    console.error('Error fetching order', error);
  }
};

const uploadImage = async () => {
  if (!uploadedImage.value) return null;
  try {
    const formData = new FormData();
    const fileInput = document.getElementById('file-upload');
    if (fileInput.files.length === 0) return null;

    formData.append('image', fileInput.files[0]);
    const token = sessionStorage.getItem('token');
    const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error('图片上传失败:', error);
    throw error;
  }
};

const saveOrder = async () => {
  if (!newOrder.value.food_name?.trim()) {
    errorMessage.value = '外卖名称不能为空';
    setTimeout(() => errorMessage.value = '', 2000);
    return;
  }

  try {
    const imageUrl = await uploadImage();
    const token = sessionStorage.getItem('token');
    const response = await axios.post('http://127.0.0.1:5000/api/order', {
      food_name: newOrder.value.food_name.trim(),
      locker_info: newOrder.value.locker_info.trim() || '待填写',
      notes: newOrder.value.notes.trim() || '无',
      is_urgent: isUrgentDelivery.value,
      size: size.value,
      delivery_address: '',
      image_url: imageUrl || null
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      sessionStorage.setItem('current_order_id', response.data.order_id);
      sessionStorage.setItem('current_order', JSON.stringify(newOrder.value));
      router.push('/Home/CreateOrder/Address');
    }
  } catch (error) {
    errorMessage.value = `提交失败: ${error.response?.data?.message || '服务器错误'}`;
    setTimeout(() => errorMessage.value = '', 2000);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.match('image.*')) {
    const reader = new FileReader();
    reader.onload = (e) => uploadedImage.value = e.target.result;
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer.files.length) {
    handleFileUpload({ target: { files: e.dataTransfer.files } });
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

onMounted(fetchOrder);
</script>

<template>
  <div class="order-container">
    <div class="step-container">
      <div class="step">
        <div class="step-icon active">🛒</div>
        <div class="step-text done">填写信息</div>
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
        <div class="step-icon">✓</div>
        <div class="step-text">支付完成</div>
      </div>
    </div>

    <div class="order-content">
      <h2>填写订单信息</h2>

      <div class="information">
        <div
          class="upload-container"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          :class="{ 'drag-active': isDragging }"
        >
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            @change="handleFileUpload"
            style="display: none;"
          />

          <div v-if="!uploadedImage" class="upload-area">
            <label for="file-upload" class="upload-label">
              <div class="upload-icon">📁</div>
              <p>点击或拖拽图片到此处上传</p>
              <p class="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB</p>
            </label>
          </div>

          <div v-else class="image-preview">
            <img :src="uploadedImage" alt="上传的图片" />
            <button @click="uploadedImage = null" class="remove-btn">×</button>
          </div>
        </div>

        <div class="input-group">
          <label for="food-name">外卖名称：</label>
          <input
            type="text"
            id="food-name"
            v-model="newOrder.food_name"
            placeholder="请输入您要点的外卖名称"
            class="food-input"
            :class="{ 'error-border': errorMessage }"
          />
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> <!-- 显示错误消息 -->
          <label for="food-address" class="food-address">外卖柜信息：</label>
          <input
            type="text"
            id="food-address"
            v-model="newOrder.locker_info"
            placeholder="请输入外卖柜信息（例：蓝田外卖柜3号柜）"
            class="food-input"
          />
          <div class="size-option">
        <label for="size" class="size-label">外卖尺寸：</label>
        <select id="size" v-model="size" class="size-select">
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      </div>
        </div>
      </div>


      <div class="delivery-option">
        <input
          type="checkbox"
          id="urgent-delivery"
          v-model="isUrgentDelivery"
          class="delivery-checkbox"
        />
        <label for="urgent-delivery" class="delivery-label">
          加急配送
        </label>
      </div>

      <div class="remark-option">
        <div class="remark-place">
          <label for="food-remark">备注：</label>
          <br>
          <input
            type="text"
            id="food-remark"
            v-model="newOrder.notes"
            placeholder="如有备注信息，请输入"
            class="remark-input"
          />
        </div>
      </div>

      <div class="button-content">
        <button class="order-button1">
          <router-link to="/Home" class="nav-link">返回首页</router-link>
        </button>
        <button class="order-button2" @click="saveOrder">
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-border {
  animation: shake 0.5s; /* 抖动0.5秒 */
  border-color: red; /* 错误时的边框颜色 */
}

@keyframes shake {
  0% { transform: translateX(1px); }
  25% { transform: translateX(-1px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}

/* 错误消息样式 */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* 基础样式保持不变 */
.remark-place {
  padding: 0 12px;
}

/* 步骤指示器动画 */
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
  transition: all 0.3s ease;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.step-icon.active {
  background-color: #007bff;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.step-icon.done {
  background-color: #e0e0e0;
}

.step-text {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.step-text.active {
  color: #333;
  font-weight: bold;
}

.step-text.done {
  color: #007bff;
}

/* 步骤指示器线条动画 */
.step-container::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ccc;
  z-index: -1;
  transition: all 0.5s ease;
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

.step.active::before {
  background-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* 容器样式 */
.order-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0px auto;
  position: relative;
  min-height: 400px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.order-content {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  transition: all 0.3s ease;
  min-height: 400px; /* 增加最小高度 */
  padding-bottom: 20px; /* 增加底部内边距 */
}

.order-content:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  padding: 0 0 0 20px;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 20px;
  width: 40px;
  height: 3px;
  background-color: #007bff;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.order-content:hover h2::after {
  width: 60px;
}

.information {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px;
  min-height: 300px; /* 增加最小高度 */
}

/* 上传区域动画 */
.upload-container {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  margin-right: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  height: 200px; /* 固定高度 */
  width: 300px; /* 固定宽度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.upload-container:hover {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.upload-container.drag-active {
  border-color: #007bff;
  background-color: #f0f8ff;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.upload-label:hover .upload-icon {
  transform: translateY(-5px);
}

.upload-label p {
  margin: 5px 0;
  color: #666;
  transition: all 0.3s ease;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

/* 图片预览动画 */
.image-preview {
  position: relative;
  max-width: 100%;
  animation: zoomIn 0.3s ease-out;
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-preview img:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
  background: #ff0000;
}

/* 输入框动画 */
.input-group {
  margin: 0 0 0 50px;
  width: 100%;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.food-input {
  width: 80%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.food-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  transform: translateY(-2px);
}

.food-input::placeholder {
  color: #999;
}

.food-address {
  margin-top: 25px;
}

/* 外卖尺寸选项样式 */
.size-option {
  margin: 20px 0 0 0;
  width: 100%;
}

.size-select {
  width: 80%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  color: #999; /* 默认提示文字颜色 */
}

.size-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.size-select:valid {
  color: #333; /* 选择后文字颜色 */
}

.size-label {
  margin-top: 20px;
  display: block;
}

/* 加急配送动画 */
.delivery-option {
  border: 1px solid #f6f3f3;
  margin: 30px 0 0 0;
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.delivery-option:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.delivery-option::placeholder {
  color: #999;
}

.delivery-label {
  margin: 0 0 0 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-label:hover {
  color: #007bff;
}

.delivery-checkbox {
  padding: 12px;
  margin-left: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-checkbox:checked {
  accent-color: #007bff;
}

.delivery-hint {
  color: red;
  font-size: 12px;
  margin: 0 0 0 12px;
  transition: all 0.3s ease;
}

.delivery-option:hover .delivery-hint {
  transform: scale(1.05);
}

/* 备注区域动画 */
.remark-option {
  border: 1px solid #f6f3f3;
  margin: 30px 0 0 0;
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.remark-option:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.remark-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
  height: 140px;
  margin: 12px 0 0 0;
}

.remark-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* 按钮动画 */
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
}

.button-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-end; 
  margin-top: 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
}

.order-button1 {
  background-color: #007bff;
  color: #007bff;
  border: 2px solid #007bff;
}

.order-button1:hover {
  background-color: #f8e1ec;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-button2 {
  background-color: #007bff;
  color: white;
}

.order-button2:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>