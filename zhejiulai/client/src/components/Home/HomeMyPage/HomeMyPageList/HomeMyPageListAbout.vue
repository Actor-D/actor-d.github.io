<script setup>
import { ref } from 'vue'

const message = ref('');
const isHovering = ref(false)

const checkUpdate = () => {
  message.value = '正在检查更新...';
  setTimeout(() => {
    message.value = '当前已是最新版本';
    setTimeout(() => {
      message.value = '';
    }, 2000);
  }, 1000);
};

const showTerms = () => {
  message.value = '跳转到服务条款页面';
  setTimeout(() => {
    message.value = '';
  }, 2000);
};
</script>

<template>
  <div class="page-container">
    <div class="header">
      <router-link
        to="/Home/MyPage"
        class="nav-back"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <svg
          class="back-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          :style="{ transform: isHovering ? 'translateX(-3px)' : 'translateX(0)' }"
        >
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
        </svg>
      </router-link>
      <h1>关于我们</h1>
      <div class="nav-placeholder"></div>
    </div>

    <div class="content">
      <transition name="bounce">
        <div class="about-logo">📱</div>
      </transition>

      <transition name="fade-slide" appear>
        <div class="about-title">浙就来</div>
      </transition>

      <transition-group name="fade-slide" tag="div" appear>
        <div class="about-info" key="info1">校园最后一公里配送专家</div>
        <div class="about-info" key="info2">版本：v1.0.0（2023）</div>

        <div class="about-info" style="margin-top: 30px;" key="info3">
          <strong>开发团队</strong><br>
          浙江大学学生创新中心<br>
          联系邮箱：support@zhejiulai.com
        </div>

        <div class="about-info" style="margin-top: 30px;" key="info4">
          ©️ 2023 浙就来校园配送<br>
          所有权利保留
        </div>
      </transition-group>

      <div class="version-check">
        <button
          class="check-update-btn"
          @click="checkUpdate"
          @mouseenter="e => e.target.classList.add('hover')"
          @mouseleave="e => e.target.classList.remove('hover')"
        >
          🔄 当前已是最新版本
        </button>
      </div>

      <transition name="fade">
        <a
          href="#"
          class="terms-link"
          @click="showTerms"
          @mouseenter="e => e.target.classList.add('hover')"
          @mouseleave="e => e.target.classList.remove('hover')"
        >
          查看服务条款
        </a>
      </transition>
    </div>
  </div>
</template>

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

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  text-align: center;
}

.about-logo {
  font-size: 48px;
  margin-bottom: 20px;
  color: #1890FF;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.about-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #1890FF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-info {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.version-check {
  margin-top: 30px;
  color: #999;
}

.terms-link {
  color: #1890FF;
  margin-top: 20px;
  display: inline-block;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.terms-link.hover {
  color: #096dd9;
  transform: translateY(-1px);
}

.terms-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #1890FF;
  transition: width 0.3s ease;
}

.terms-link.hover::after {
  width: 100%;
}

.check-update-btn {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: #666;
  margin-top: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.check-update-btn.hover {
  background: #e6e6e6;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>