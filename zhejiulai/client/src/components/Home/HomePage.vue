<template>
  <div class="container">
    <div class="main-title">
      <h1>校园生活更轻松</h1>
      <p>专业的校园配送服务平台</p>
    </div>

    <div class="services">
      <div class="service-item">
        <div class="service-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#40a9ff">
            <path d="M20,18h-4V8h4V18z M10,18H6v-8h4V18z M20,6h-4V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v2H4C2.9,6,2,6.9,2,8v8 c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z"></path>
          </svg>
        </div>
        <div class="service-title">代取外卖</div>
        <div class="service-desc">轻松解决用餐问题，准时送达</div>
        <router-link to="/Home/CreateOrder/Info" class="btn-use">创建订单</router-link>
      </div>

      <div class="service-item">
        <div class="service-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#40a9ff">
            <path d="M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z"></path>
          </svg>
        </div>
        <div class="service-title">代取快递</div>
        <div class="service-desc">快速代取服务，安全便捷</div>
        <button class="btn-use">立即使用(无功能）</button>
      </div>

      <div class="service-item">
        <div class="service-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#40a9ff">
            <path d="M20,18h-4V8h4V18z M10,18H6v-8h4V18z M20,6h-4V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v2H4C2.9,6,2,6.9,2,8v8 c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z"></path>
          </svg>
        </div>
        <div class="service-title">代送物品</div>
        <div class="service-desc">校园内物品配送，随时随地</div>
        <router-link to="/Home/CreateOrder/Good" class="btn-use">立即使用</router-link>
      </div>
    </div>

    <div class="ads">
    <div class="ads-title">广告招商位</div>

    <div class="ads-list">
      <!-- 使用TransitionGroup实现动画效果 -->
      <TransitionGroup name="ads" tag="div" class="ads" mode="out-in"
                      @before-enter="beforeEnter"
                      @enter="enter">
        <!-- 动态渲染可见广告 -->
        <div class="ad-item"
             v-for="(ad, index) in visibleAds"
             :key="`${ad.title}-${currentIndex}-${index}`"
             :data-index="index">
          <div class="ad-text">{{ ad.title }}</div>
          <div class="ad-text">{{ ad.phone }}</div>
          <div class="ad-text">{{ ad.summary }}</div>
        </div>
      </TransitionGroup>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

// 1. 定义广告数据存储库
const useAdStore = defineStore('advertisements', {
  state: () => ({
    ads: [],       // 广告数据
    isLoading: true, // 加载状态
    error: null    // 错误信息
  }),
  actions: {
    async fetchAds() {
      this.isLoading = true;
      try {
        const response = await fetch('/HomePage/AdvertisementInfo.json');
        if (!response.ok) throw new Error(`广告加载失败! 状态码: ${response.status}`);
        this.ads = await response.json();
      } catch (err) {
        console.error('广告数据获取失败:', err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});

// 2. 初始化存储库
const adStore = useAdStore();
const { ads, isLoading } = storeToRefs(adStore);

// 3. 轮播逻辑
const currentIndex = ref(0);
const visibleCount = 3; // 每屏显示3个广告

// 计算当前可见的广告
const visibleAds = computed(() => {
  if (!ads.value || ads.value.length === 0) return [];

  const result = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex.value + i) % ads.value.length;
    result.push(ads.value[index]);
  }
  return result;
});

// 4. 自动轮播
let interval;
onMounted(() => {
  adStore.fetchAds();

  interval = setInterval(() => {
    if (ads.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % ads.value.length;

      // 边界处理（到达最后时无感知跳转）
      if (currentIndex.value === ads.value.length - 1) {
        setTimeout(() => {
          currentIndex.value = 0;
        }, 300); // 略短于过渡时间
      }
    }
  }, 5000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

// 5. 动画效果
const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(-20px)';
};

const enter = (el, done) => {
  const delay = el.dataset.index * 100;
  setTimeout(() => {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
    done();
  }, delay);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", sans-serif;
}

body {
  background-color: #fff;
  color: #333;
}

.container {
  margin: 0 auto;
}

.main-title {
  text-align: center;
  padding: 20px 0;
}

.main-title h1 {
  font-size: 20px;
  margin-bottom: 5px;
}

.main-title p {
  font-size: 14px;
  color: #999;
}

.services {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.service-item {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.service-icon {
  width: 60px;
  height: 60px;
  background-color: #f0f8ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
}

.service-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.btn-use,
:deep(.btn-use) {
  display: inline-block;
  text-decoration: none;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 25px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
  position: relative;
  overflow: hidden;
}

/* 悬停效果 */
.btn-use:hover,
:deep(.btn-use):hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #36cfc9 0%, #1890ff 100%);
  box-shadow: 0 6px 12px rgba(24, 144, 255, 0.3);
}

/* 点击效果 */
.btn-use:active,
:deep(.btn-use):active {
  transform: scale(0.98);
  background: #096dd9;
}

/* 脉冲动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

/* 禁用状态 */
.btn-use:disabled,
:deep(.btn-use):disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none !important;
}


.btn-use:hover::after,
:deep(.btn-use):hover::after {
  margin-left: 8px;
  opacity: 1;
}

.ads {
  margin-top: 30px;
}

.ads-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.ad-item {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 15px;
}

.ad-text {
  text-align: center;
  color: #666;
  line-height: 1.8;
  font-size: 14px;
}

.footer-item :deep(a) {
  color: inherit;
  text-decoration: none;
}

.service-title {
  font-size: 22px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

</style>