<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

const router = useRouter();
const loading = ref(false);
const message = ref('');
const messageType = ref('');
const isDarkMode = ref(false);

onMounted(() => {
  const savedMode = sessionStorage.getItem('darkMode');
  isDarkMode.value = savedMode === 'true';
  applyDarkMode();
});

const applyDarkMode = () => {
  const root = document.querySelector('.page-container');
  if (isDarkMode.value) {
    root.classList.add('dark-mode');
  } else {
    root.classList.remove('dark-mode');
  }
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  sessionStorage.setItem('darkMode', isDarkMode.value); // 修正拼写错误
  applyDarkMode();
};

watch(isDarkMode, (newVal) => {
  sessionStorage.setItem('darkMode', newVal);
  applyDarkMode();
});

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    alert('您已退出登录');
    sessionStorage.removeItem('token');
    router.push('/');
  }
};

const showMessage = (text, type) => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 3000);
};

const clearCache = async () => {
  if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return;

  loading.value = true;
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.delete('http://127.0.0.1:5000/api/clear_data', {
      headers: {Authorization: `Bearer ${token}`}
    });

    if (response.data.success) {
      showMessage('数据已成功清除', 'success');
    } else {
      showMessage('清除失败: ' + response.data.message, 'error');
    }
  } catch (error) {
    console.error('清除数据出错:', error);
    showMessage('清除数据出错，请重试', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="message" class="message-box" :class="messageType">
    {{ message }}
  </div>
  <div class="page-container">
    <div class="header">
      <router-link to="/Home/MyPage" class="nav-back">
        <svg class="back-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
        </svg>
      </router-link>
      <h1>⚙️ 设置</h1>
      <div class="nav-placeholder"></div>
    </div>

    <div class="container">
      <div class="form-card">
        <div class="section-title">通用设置</div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-icon">🔔</div>
            <div>消息通知（无作用）</div>
          </div>
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-icon">🌙</div>
            <div>夜间模式(仅能在当前页面实现夜间模式）</div>
          </div>
          <label class="switch">
            <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="form-card">
        <div class="section-title">其他设置</div>

        <div class="setting-item" @click="clearCache">
          <div class="setting-info">
            <div class="setting-icon">🗑️</div>
            <div>清除数据</div>
          </div>
          <div class="arrow">→</div>
          <div v-if="loading" class="loading-spinner"></div>
        </div>

        <router-link to="/Home/MyPage/About" class="setting-item">
          <div class="setting-info">
            <div class="setting-icon">ℹ️</div>
            <div>关于我们</div>
          </div>
          <div class="arrow">→</div>
        </router-link>
      </div>

      <button class="logout-btn" @click="logout">
        退出登录
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 原有样式保持不变 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", sans-serif;
}

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  transition: background-color 0.3s, color 0.3s;
}

/* 夜间模式样式 */
.page-container.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.page-container.dark-mode .form-card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.page-container.dark-mode .section-title {
  color: #9e9e9e;
  border-bottom: 1px solid #333;
}

.page-container.dark-mode .setting-item {
  border-bottom: 1px solid #333;
}

.page-container.dark-mode .logout-btn {
  background-color: #1e1e1e;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}

.page-container.dark-mode .slider {
  background-color: #666;
}

.page-container.dark-mode input:checked + .slider {
  background-color: #64B5F6;
}

/* 原有样式继续保留 */
.header {
  background-color: #1890FF;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: 18px;
  flex: 1;
  text-align: center;
  margin: 0;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.back-icon {
  transition: transform 0.2s;
}

.nav-back:active .back-icon {
  transform: scale(0.9);
}

.nav-placeholder {
  width: 24px;
}

.container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.form-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, color 0.3s;
}

.section-title {
  font-size: 16px;
  color: #8C8C8C;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s, border-color 0.3s;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: border-color 0.3s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  align-items: center;
}

.setting-icon {
  margin-right: 12px;
  font-size: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #1890FF;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.arrow {
  color: #8C8C8C;
  font-size: 16px;
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background-color: white;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 12px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.message-box {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.message-box.success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message-box.error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

@keyframes slideIn {
  from {
    top: -50px;
    opacity: 0;
  }
  to {
    top: 20px;
    opacity: 1;
  }
}
</style>