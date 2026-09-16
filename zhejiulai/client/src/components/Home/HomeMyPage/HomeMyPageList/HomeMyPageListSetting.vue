<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    alert('您已退出登录');
    // 清除本地存储中的 token
    sessionStorage.removeItem('token');
    // 跳转到登录页面
    router.push('/');
  }
};
</script>

<template>
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
            <div>消息通知</div>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="notifications">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-icon">🌙</div>
            <div>夜间模式</div>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="darkMode">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="form-card">
        <div class="section-title">其他设置</div>

        <div class="setting-item" @click="clearCache">
          <div class="setting-info">
            <div class="setting-icon">🗑️</div>
            <div>清除缓存</div>
          </div>
          <div class="arrow">→</div>
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
/* 样式保持不变，与之前相同 */
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
}

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
}

.section-title {
  font-size: 16px;
  color: #8C8C8C;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
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
}
</style>