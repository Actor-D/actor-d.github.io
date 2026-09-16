<template>
  <div class="container">
    <!-- 顶部用户信息卡片 -->
    <div class="card user-profile">
      <div class="user-card">
        <div class="avatar">校</div>
        <div class="user-info">
          <div class="user-name">
            {{ userInfo.name }}
            <router-link to="/Home/MyPage/Personalinfo" class="edit-icon">✏</router-link>
          </div>
          <div class="badge">🎓 学生认证</div>
          <div class="points">✨ ：积分{{ userInfo.points }}（可兑换礼品）</div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: userInfo.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人信息模块 -->
    <div class="card info-card">
      <div class="section-title">个人信息</div>
      <div class="info-item">
        <span class="info-label">姓名</span>
        <span>{{ userInfo.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">学号</span>
        <span>{{ userInfo.student_id }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">手机</span>
        <span>{{ userInfo.phone }}</span>
      </div>
      <router-link to="/Home/MyPage/Personalinfo" class="edit-link">修改资料</router-link>
    </div>

    <!-- 常用地址管理 -->
    <div class="card address-card">
      <div class="section-title">常用地址</div>
      <div v-if="addresses.length > 0">
        <!-- 默认地址始终显示在第一个 -->
        <div class="address-item" v-if="defaultAddress">
          <div class="address-info">
            <div class="address-title">{{ defaultAddress.title }}</div>
            <div class="address-detail">{{ defaultAddress.detail }}</div>
          </div>
          <div class="default-badge">默认</div>
        </div>
        <!-- 其他地址 -->
        <div class="address-item" v-for="address in otherAddresses" :key="address.id">
          <div class="address-info">
            <div class="address-title">{{ address.title }}</div>
            <div class="address-detail">{{ address.detail }}</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-text">请添加您的地址</div>
      </div>
      <router-link to="/Home/MyPage/Address" class="manage-link">管理地址</router-link>
    </div>

    <!-- 服务与反馈 -->
    <router-link to="/Home/MyPage/Feedback" class="card clickable-card">
      <div class="menu-item">
        <div class="menu-icon">📮</div>
        <div class="menu-text">意见反馈</div>
        <div class="menu-arrow">→</div>
      </div>
    </router-link>

    <router-link to="/Home/MyPage/About" class="card clickable-card">
      <div class="menu-item">
        <div class="menu-icon">ℹ️</div>
        <div class="menu-text">关于我们</div>
        <div class="menu-arrow">→</div>
      </div>
    </router-link>

    <router-link to="/Home/MyPage/Setting" class="card clickable-card">
      <div class="menu-item">
        <div class="menu-icon">⚙️</div>
        <div class="menu-text">设置</div>
        <div class="menu-arrow">→</div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const userInfo = ref({
  name: '',
  student_id: '',
  phone: '',
  progress: 0,
  points: 0 // 积分字段
});

const addresses = ref([]);

const fetchUserInfo = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/user_profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.success) {
      userInfo.value = response.data.user;
    } else {
      console.error('Failed to fetch user info:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

const fetchAddresses = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    addresses.value = response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

const defaultAddress = computed(() => addresses.value.find(addr => addr.is_default));
const otherAddresses = computed(() => addresses.value.filter(addr => !addr.is_default));

onMounted(() => {
  fetchUserInfo();
  fetchAddresses();
});
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", sans-serif;
}

body {
  background-color: #f5f5f5;
  color: #333;
  padding: 0;
  max-width: 100vw;
  overflow-x: hidden;
}

.container {
  width: 100%;
  padding: 16px;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
}

.user-profile {
  background: linear-gradient(135deg, #f6f9ff 0%, #e6f0ff 100%);
  border-left: 4px solid #1890FF;
}

.info-card {
  border-left: 4px solid lightpink;
}

.points-card {
  border-left: 4px solid #faad14;
}

.address-card {
  border-left: 4px solid #722ed1;
}

.user-card {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #1890FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18pt;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.edit-icon {
  margin-left: 8px;
  font-size: 14pt;
  color: #8C8C8C;
  cursor: pointer;
  transition: color 0.2s ease;
}

.edit-icon:hover {
  color: #1890FF;
}

.badge {
  display: inline-block;
  background-color: #fffae6;
  color: #d48806;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #ffe58f;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.points {
  display: flex;
  align-items: center;
  font-size: 14pt;
  color: #8C8C8C;
}

.progress-bar {
  height: 6px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.progress {
  height: 100%;
  width: 65%;
  background: linear-gradient(90deg, #1890FF, #69c0ff);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.section-title {
  font-size: 16px;
  color: #8C8C8C;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14pt;
  transition: background-color 0.2s ease;
}

.info-item:hover {
  background-color: rgba(0, 0, 0, 0, 0.02);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #8C8C8C;
}

.edit-link {
  color: #1890FF;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  font-size: 14pt;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.edit-link:hover {
  color: #096dd9 !important;
  text-decoration: underline;
}

.points-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.points-container::-webkit-scrollbar {
  display: none;
}

.points-item {
  min-width: 200px;
  padding: 12px;
  background: linear-gradient(135deg, #f6f9ff 0%, #e6f7ff 100%);
  border-radius: 8px;
  margin-right: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

.points-item:hover {
  transform: translateY(-2px);
}

.points-title {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 8px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14pt;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.task-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.task-points {
  color: #FFA940;
  font-weight: 500;
}

.task-incomplete {
  color: #bfbfbf;
}

.address-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.address-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.address-info {
  flex: 1;
}

.address-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.address-detail {
  color: #8C8C8C;
  font-size: 13px;
}

.default-badge {
  background-color: #1890FF;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px; /* 调整高度 */
  text-align: center;
}

.empty-text {
  color: #8C8C8C;
  font-size: 14pt;
  margin-bottom: 24px;
}

.manage-link {
  color: #1890FF;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  font-size: 14pt;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.manage-link:hover {
  color: #096dd9 !important;
  text-decoration: underline;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  transition: all 0.2s ease;
}

.menu-item:hover {
  transform: translateX(4px);
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
  color: #8C8C8C;
}

.menu-text {
  flex: 1;
  font-size: 14pt;
}

.menu-arrow {
  color: #8C8C8C;
  font-size: 16pt;
  transition: transform 0.2s ease;
}

.menu-item:hover .menu-arrow {
  transform: translateX(4px);
}

/* 新增样式 */
.clickable-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.clickable-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* 确保链接样式优先级最高 */
.edit-link, .manage-link {
  color: #1890FF !important;
  font-weight: 500 !important;
}
</style>