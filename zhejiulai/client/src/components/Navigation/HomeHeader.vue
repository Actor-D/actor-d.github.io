<template>
  <div class="container">
    <div class="header">
      <router-link
        to="/Home/MyPage/About"
        class="logo-btn"
        @mouseenter="logoHover = true"
        @mouseleave="logoHover = false"
        :style="logoStyle"
      >
        <span class="logo-icon">🛵</span>
        <span class="logo-text">浙就来 校园专属配送平台</span>
      </router-link>
      <div class="header-right">
        <div class="nav-group">
          <router-link
            to="/Home/Service"
            class="nav-btn help-btn"
            @mouseenter="helpHover = true"
            @mouseleave="helpHover = false"
            :style="helpStyle"
          >
            <span class="nav-icon">📞</span>
            <span class="nav-text">联系客服</span>
          </router-link>
          <span
            class="nav-btn service-btn"
            @mouseenter="serviceHover = true"
            @mouseleave="serviceHover = false"
            :style="serviceStyle"
          >
            <span class="nav-icon">❓</span>
            <span class="nav-text">帮助中心</span>
          </span>
        </div>
        <div class="switch-container">
          <button
            class="nav-btn switch-btn"
            @mouseenter="switchHover = true"
            @mouseleave="switchHover = false"
            @click="toggleSwitch"
            :style="switchStyle"
          >
            <span class="nav-icon">🔄</span>
            <span class="nav-text">一键切换</span>
          </button>
          <transition
            name="custom-dropdown"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
          >
            <div
              v-show="showOptions"
              class="switch-options"
              ref="dropdown"
            >
              <div
                class="option"
                :class="{
                  active: currentRole === '用户',
                  pulse: selectedOption === '用户'
                }"
                @click="selectOption('用户')"
                @mouseenter="optionHover('用户')"
                @mouseleave="resetOptionHover"
              >
                <span class="option-icon">👤</span>用户
              </div>
              <div
                class="option"
                :class="{
                  active: currentRole === '配送员',
                  pulse: selectedOption === '配送员'
                }"
                @click="selectOption('配送员')"
                @mouseenter="optionHover('配送员')"
                @mouseleave="resetOptionHover"
              >
                <span class="option-icon">🚴</span>配送员
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 状态管理
const showOptions = ref(false);
const currentRole = ref('用户');
const selectedOption = ref(null);

// 悬停状态
const logoHover = ref(false);
const helpHover = ref(false);
const serviceHover = ref(false);
const switchHover = ref(false);

// 动态样式计算
const logoStyle = computed(() => ({
  transform: logoHover.value ? 'scale(1.05)' : 'scale(1)',
  boxShadow: logoHover.value
    ? '0 4px 8px rgba(30, 144, 255, 0.3)'
    : '0 2px 4px rgba(0, 0, 0, 0.1)'
}));

const helpStyle = computed(() => ({
  transform: helpHover.value ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)'
}));

const serviceStyle = computed(() => ({
  transform: serviceHover.value ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)'
}));

const switchStyle = computed(() => ({
  transform: switchHover.value ? 'translateY(-3px) rotate(15deg)' : 'translateY(0) rotate(0)'
}));

// 方法定义
const toggleSwitch = () => {
  showOptions.value = !showOptions.value;
};

const selectOption = (role) => {
  selectedOption.value = role;
  setTimeout(() => {
    currentRole.value = role;
    showOptions.value = false;
    selectedOption.value = null;
  }, 300); // 与动画持续时间匹配
};

const optionHover = (option) => {
  selectedOption.value = option;
};

const resetOptionHover = () => {
  if (selectedOption.value !== currentRole.value) {
    selectedOption.value = null;
  }
};

// 动画钩子
const dropdown = ref(null);

const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(-10px)';
};

const enter = (el, done) => {
  const animation = el.animate(
    [
      { opacity: 0, transform: 'translateY(-10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  );
  animation.onfinish = () => {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
    done();
  };
};

const leave = (el, done) => {
  const animation = el.animate(
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-10px)' }
    ],
    {
      duration: 150,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  );
  animation.onfinish = () => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(-10px)';
    done();
  };
};
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 字体定义 */
:root {
  font-family:
    "PingFang SC",
    "Microsoft YaHei",
    -apple-system,
    sans-serif;
}

/* 容器样式 */
.container {
  --primary-blue: #1e90ff;
  --help-orange: #FF8C00;
  --service-purple: #9370DB;
  --switch-pink: hotpink;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-base: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 头部布局 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #fff;
  position: relative;
  z-index: 100;
}

/* Logo按钮样式 */
.logo-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: var(--primary-blue);
  color: white;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  will-change: transform;
}

.logo-icon {
  margin-right: 8px;
  font-size: 18px;
  transition: var(--transition-base);
}

/* 右上角导航区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-group {
  display: flex;
  gap: 10px;
}

/* 导航按钮通用样式 */
.nav-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  color: white;
  border-radius: 30px;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
  will-change: transform;
}

.nav-icon {
  margin-right: 5px;
  font-size: 16px;
  transition: var(--transition-base);
}

.nav-text {
  white-space: nowrap;
}

/* 各按钮专属样式 */
.help-btn {
  background: var(--help-orange);
}

.service-btn {
  background: var(--service-purple);
}

.switch-btn {
  background: var(--switch-pink);
}

/* 下拉菜单容器 */
.switch-container {
  position: relative;
}

/* 下拉选项面板 */
.switch-options {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 120px;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  z-index: 10;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 选项样式 */
.option {
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  position: relative;
}

.option:hover {
  background: #f5f5f5;
}

.option.active {
  color: var(--primary-blue);
  font-weight: 500;
}

.option.pulse {
  animation: pulse 0.3s ease;
}

.option-icon {
  margin-right: 8px;
  font-size: 16px;
  transition: var(--transition-base);
}

/* 自定义动画 */
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

/* 自定义过渡动画 */

</style>