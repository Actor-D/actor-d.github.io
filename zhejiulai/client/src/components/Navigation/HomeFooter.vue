<template>
  <div class="container">
    <div class="footer">
      <div
        v-for="(item, index) in footerItems"
        :key="index"
        class="footer-item"
        :class="{ 'active': activeIndex === index }"
        @click="handleItemClick(index, item.path)"
      >
        <div class="footer-icon-wrapper">
          <div class="footer-icon-background">
            <div class="footer-icon">{{ item.icon }}</div>
          </div>
          <div class="active-indicator"></div>
        </div>
        <span class="footer-text">{{ item.text }}</span>
      </div>
      <div class="footer-highlight" :style="highlightStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeIndex = ref(0)
const footerItems = [
  { icon: '🏠', text: '首页', path: '/Home' },
  { icon: '📋', text: '订单', path: '/Home/ViewOrder' },
  { icon: '🔔', text: '消息', path: '/Home/MessagePageList' },
  { icon: '👤', text: '我的', path: '/Home/MyPage' }
]

// 监听路由变化更新activeIndex
watch(() => route.path, (newPath) => {
  const index = footerItems.findIndex(item => item.path === newPath)
  if (index !== -1) {
    activeIndex.value = index
  }
}, { immediate: true })

const highlightStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * 100}%)`
}))

// 处理点击事件
const handleItemClick = (index, path) => {
  activeIndex.value = index
  router.push(path)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Helvetica Neue", sans-serif;
}

.container {
  margin: 0 auto;
}

.footer {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 16px 0 24px;
  background: white;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.05);
  border-radius: 24px 24px 24px 24px;
  overflow: hidden;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 8px 16px;
  z-index: 2;
  user-select: none;
}

.footer-text {
  transition: color 0.3s ease;
  color: #3b82f6; /* 蓝色文字 */
  margin-top: 6px;
}

.footer-icon-wrapper {
  position: relative;
}

.footer-icon-background {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dbeafe; /* 淡蓝色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer-icon {
  font-size: 22px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.active-indicator {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 56px;
  height: 56px;
  background: rgba(219, 234, 254, 0.4); /* 淡蓝色光晕 */
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.footer-item.active {
  transform: translateY(-4px);
}

.footer-item.active .footer-text {
  color: #2563eb; /* 深蓝色文字 */
  font-weight: 600;
}

.footer-item.active .footer-icon-background {
  background: #bfdbfe; /* 中等蓝色背景 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.footer-item.active .footer-icon {
  transform: scale(1.1);
}

.footer-item.active .active-indicator {
  opacity: 1;
  transform: scale(1);
}

.footer-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 25%;
  height: 3px;
  background: #3b82f6; /* 蓝色高亮条 */
  border-radius: 3px 3px 0 0;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* 微交互效果 */
.footer-item:not(.active):hover {
  color: #555;
}

.footer-item:not(.active):hover .footer-icon-background {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.footer-item:not(.active):hover .footer-text {
  color: #555;
}

/* 点击涟漪效果 */
.footer-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(59, 130, 246, 0.3); /* 蓝色涟漪 */
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.footer-item:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}
</style>