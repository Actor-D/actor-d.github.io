<template>
  <div class="page-container">
    <div class="header">
      <router-link
        to="/Home/MyPage"
        class="nav-back"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <transition name="bounce">
          <svg
            class="back-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            :style="{ transform: isHovering ? 'translateX(-3px)' : 'translateX(0)' }"
          >
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
          </svg>
        </transition>
      </router-link>
      <h1>✏️ 修改资料</h1>
      <div class="nav-placeholder"></div>
    </div>

    <div class="container">
      <transition-group name="fade-slide" tag="div">
        <div class="form-card" key="basic">
          <div class="section-title">基础信息</div>

          <div class="avatar-edit">
            <transition name="pulse" mode="out-in">
              <div class="avatar-preview" key="avatar">{{ userInfo.avatar }}</div>
            </transition>
            <div class="avatar-actions">
              <button class="avatar-btn">从相册选择</button>
              <button class="avatar-btn" @click="revertToDefault">恢复默认</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">昵称</label>
            <div class="input-wrapper">
              <input
                type="text"
                class="form-input"
                placeholder="输入2-10字符昵称"
                v-model="userInfo.name"
                required
              />
              <span class="char-counter">{{ userInfo.name.length }}/10</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">手机号</label>
            <div class="input-wrapper">
              <input
                type="text"
                class="form-input"
                placeholder="输入手机号"
                v-model="userInfo.phone"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">校区</label>
            <div class="input-wrapper">
              <select v-model="userInfo.campus" required class="form-input">
                <option v-for="campus in campuses" :key="campus" :value="campus">
                  {{ campus }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </transition-group>

      <div class="button-group">
        <button class="secondary-btn" @click="revertToDefault">
          <span class="btn-icon">↩️</span>
          恢复默认
        </button>
        <button class="primary-btn active" @click="updateProfile">
          <span class="btn-icon">💾</span>
          保存修改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const isHovering = ref(false)
const userInfo = ref({
  name: '',
  phone: '',
  campus: '',
  avatar: '校'
})
const initialUserInfo = ref(null)

const token = sessionStorage.getItem('token')

const fetchUserInfo = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/user_profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data.success) {
      userInfo.value = response.data.user
      initialUserInfo.value = { ...response.data.user } // 保存初始信息
    } else {
      console.error('Failed to fetch user info:', response.data.message)
    }
   } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const revertToDefault = () => {
  userInfo.value = { ...initialUserInfo.value } // 恢复初始信息
}

const updateProfile = async () => {
  try {
    const response = await axios.put('http://127.0.0.1:5000/api/update_profile', userInfo.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data.success) {
      alert('个人信息更新成功')
      window.history.back() // 返回到上一个页面
    } else {
      alert('更新失败: ' + response.data.message)
    }
   } catch (error) {
    console.error('Error updating user info:', error)
    alert('更新失败，请稍后再试')
  }
}

onMounted(fetchUserInfo)

const campuses = [
  '浙江大学紫金港校区',
  '浙江大学玉泉校区',
  '浙江大学西溪校区',
  '浙江大学华家池校区',
  '浙江大学之江校区'
]
</script>

<style scoped>
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-title {
  font-size: 16px;
  color: #8C8C8C;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #1890FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(24, 144, 255, 0.4);
}

.avatar-actions {
  display: flex;
  gap: 12px;
}

.avatar-btn {
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: none;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-btn:hover {
  background-color: #e6e6e6;
  transform: translateY(-1px);
}

.avatar-btn:active {
  transform: translateY(0);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14pt;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 10px 0;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14pt;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.char-counter {
  position: absolute;
  right: 16px;
  bottom: 12px;
  font-size: 12px;
  color: #8C8C8C;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.security-info {
  font-size: 14pt;
}

.security-action {
  color: #1890FF;
  text-decoration: none;
  font-size: 14pt;
  transition: all 0.2s ease;
}

.security-action:hover {
  color: #096dd9;
  text-decoration: underline;
}

.display-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14pt;
  transition: all 0.3s ease;
}

.display-label {
  color: #8C8C8C;
  margin-bottom: 4px;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.primary-btn {
  flex: 1;
  padding: 14px;
  background-color: #f5f5f5;
  color: #8C8C8C;
  border: none;
  border-radius: 12px;
  font-size: 14pt;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn.active {
  background-color: #1890FF;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.primary-btn.active:hover {
  background-color: #096dd9;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(24, 144, 255, 0.4);
}

.primary-btn.active:active {
  transform: translateY(0);
}

.secondary-btn {
  flex: 1;
  padding: 14px;
  background-color: white;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 14pt;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  border-color: #1890FF;
  color: #1890FF;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.secondary-btn:active {
  transform: translateY(0);
}

.btn-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 新增动画效果 */
@keyframes bounce-in {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
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

/* 下拉框样式 */
.form-input, select {
  width: 100%;
  padding: 10px 0;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14pt;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus, select:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>