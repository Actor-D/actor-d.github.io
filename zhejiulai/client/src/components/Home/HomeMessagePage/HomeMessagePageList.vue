<template>
  <div class="message-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧消息分类 -->
      <div class="message-sidebar">
        <h2 class="sidebar-title">消息分类</h2>
        <div class="category-list">
          <div class="category-item active">
            <span class="category-icon all-icon"></span>
            <span class="category-text">全部消息</span>
          </div>
          <div class="category-item">
            <span class="category-icon system-icon"></span>
            <span class="category-text">系统通知</span>
          </div>
          <div class="category-item">
            <span class="category-icon order-icon"></span>
            <span class="category-text">订单消息</span>
          </div>
          <div class="category-item">
            <span class="category-icon review-icon"></span>
            <span class="category-text">评价消息</span>
          </div>
          <div class="category-item">
            <span class="category-icon service-icon"></span>
            <span class="category-text">客服消息</span>
          </div>
        </div>
      </div>

      <!-- 右侧消息内容 -->
      <div class="message-content">
        <div class="search-box">
          <div class="search-container">
            <span class="search-icon"></span>
            <input
              type="text"
              class="search-input"
              placeholder="搜索消息内容"
              v-model="searchText"
            >
          </div>
        </div>

        <div class="message-list">
          <!-- 骑手消息 -->
          <router-link
            to="/Home/MessagePageDetail"
            class="message-item-link"
            tag="div"
          >
            <div class="message-item">
              <div class="avatar rider-avatar"></div>
              <div class="message-info">
                <div class="sender">小蜜蜂</div>
                <div class="content">您好，我已经取到您的外卖了</div>
              </div>
              <div class="time">刚刚</div>
            </div>
          </router-link>

          <!-- 系统通知 -->
          <router-link
            to="/Home/MessagePageDetail"
            class="message-item-link"
            tag="div"
          >
            <div class="message-item">
              <div class="avatar system-avatar"></div>
              <div class="message-info">
                <div class="sender">系统通知</div>
                <div class="content">您的订单已完成，请及时评价</div>
              </div>
              <div class="time">10分钟前</div>
            </div>
          </router-link>

          <!-- 快递员消息 -->
          <router-link
            to="/Home/MessagePageDetail"
            class="message-item-link"
            tag="div"
          >
            <div class="message-item">
              <div class="avatar delivery-avatar"></div>
              <div class="message-info">
                <div class="sender">张三</div>
                <div class="content">快递已经放在菜鸟驿站了</div>
              </div>
              <div class="time">1小时前</div>
            </div>
          </router-link>

          <!-- 客服消息 -->
          <router-link
            to="/Home/MessagePageDetail"
            class="message-item-link"
            tag="div"
          >
            <div class="message-item">
              <div class="avatar service-avatar"></div>
              <div class="message-info">
                <div class="sender">在线客服</div>
                <div class="content">有什么可以帮助您吗？</div>
              </div>
              <div class="time">2小时前</div>
            </div>
          </router-link>

          <!-- 系统通知 -->
          <router-link
            to="/Home/MessagePageDetail"
            class="message-item-link"
            tag="div"
          >
            <div class="message-item">
              <div class="avatar system-avatar"></div>
              <div class="message-info">
                <div class="sender">系统通知</div>
                <div class="content">您的订单已完成支付</div>
              </div>
              <div class="time">2小时前</div>
            </div>
          </router-link>
        </div>

        <div class="mark-read">标记全部已读</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchText = ref('');
</script>

<style scoped>
/* 全局样式 */
body {
  font-family: "PingFang SC", sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
}

/* 页面容器 */
.message-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* 主要内容区域 */
.main-content {
  display: flex;
}

/* 左侧消息分类 */
.message-sidebar {
  width: 200px;
  padding-right: 20px;
  border-right: 1px solid #e8e8e8;
}

.sidebar-title {
  font-size: 18pt;
  margin-bottom: 20px;
  color: #1890FF;
  position: relative;
}

.sidebar-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #1890FF;
  border-radius: 3px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item {
  display: flex;
  align-items: center;
  font-size: 14pt;
  padding: 10px 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.category-item.active {
  background-color: #1890FF;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.category-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

.category-item:hover .category-icon {
  transform: scale(1.1);
}

.all-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"/></svg>');
}

.system-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/></svg>');
}

.order-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM8 10h5V7H8v3zm-1 5H7v-3h3v3zm1-2h5v-3H8v3z"/></svg>');
}

.review-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
}

.service-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>');
}

.category-item.active .all-icon,
.category-item.active .system-icon,
.category-item.active .order-icon,
.category-item.active .review-icon,
.category-item.active .service-icon {
  filter: brightness(0) invert(1);
}

/* 右侧消息内容 */
.message-content {
  flex: 1;
  padding-left: 20px;
}

/* 搜索框美化 */
.search-box {
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
}

.search-input:focus + .search-icon {
  transform: scale(1.1);
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 10px 15px 10px 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14pt;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  padding-left: 45px;
}

/* 消息列表 */
.message-list {
  margin-bottom: 20px;
}

.message-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.message-item:hover {
  background-color: rgba(24, 144, 255, 0.05);
  transform: translateX(5px);
}

.message-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 3px;
  background: #1890FF;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
}

.message-item:hover::before {
  transform: scaleY(1);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
}

.message-item:hover .avatar {
  transform: scale(1.1);
}

.rider-avatar {
  background-color: #FFD700;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>');
}

.system-avatar {
  background-color: #1890FF;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>');
}

.delivery-avatar {
  background-color: #4CAF50;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M19 7h-3V5.5A2.5 2.5 0 0 0 13.5 3h-3A2.5 2.5 0 0 0 8 5.5V7H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-1.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V7h-4V5.5zM19 17H5V9h14v8z"/></svg>');
}

.service-avatar {
  background-color: #9C27B0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>');
}

.message-info {
  flex: 1;
}

.sender {
  font-size: 14pt;
  font-weight: 500;
  margin-bottom: 5px;
  transition: color 0.3s ease;
}

.message-item:hover .sender {
  color: #1890FF;
}

.content {
  font-size: 14pt;
  color: #666;
  transition: color 0.3s ease;
}

.message-item:hover .content {
  color: #333;
}

.time {
  font-size: 12pt;
  color: #999;
  margin-left: 20px;
  transition: color 0.3s ease;
}

.message-item:hover .time {
  color: #666;
}

/* 标记已读按钮 */
.mark-read {
  font-size: 14pt;
  color: #1890FF;
  text-align: right;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
  position: relative;
}

.mark-read:hover {
  color: #096dd9;
  transform: translateX(-5px);
}

.mark-read::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #1890FF;
  transition: width 0.3s ease;
}

.mark-read:hover::after {
  width: 100%;
}
</style>