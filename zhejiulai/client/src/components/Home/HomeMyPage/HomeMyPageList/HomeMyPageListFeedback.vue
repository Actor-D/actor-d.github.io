<script setup>
import { ref, computed } from 'vue'

const feedbackType = ref('bug')
const feedbackContent = ref('')
const contactInfo = ref('')
const showSuccessModal = ref(false)

const charCount = computed(() => {
  return `${feedbackContent.value.length}/50`
})

const canSubmit = computed(() => {
  return feedbackContent.value.length >= 10 && feedbackContent.value.length <= 50
})

const checkFeedbackForm = () => {
  // 实时计算字符数
}

const uploadImage = () => {
  alert('打开相册选择图片')
}

const submitFeedback = () => {
  console.log('提交反馈:', {
    type: feedbackType.value,
    content: feedbackContent.value,
    contact: contactInfo.value
  })

  showSuccessModal.value = true

  setTimeout(() => {
    feedbackContent.value = ''
    contactInfo.value = ''
    showSuccessModal.value = false
  }, 2000)
}

const closeModal = () => {
  showSuccessModal.value = false
}
</script>

<template>
  <div class="page-container">
    <!-- 统一风格的顶部导航栏 -->
    <div class="header">
      <router-link to="/Home/MyPage" class="nav-back">
        <svg class="back-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
        </svg>
      </router-link>
      <h1>意见反馈</h1>
      <button
        class="submit-btn"
        :disabled="!canSubmit"
        @click="submitFeedback"
        :class="{ disabled: !canSubmit }"
      >
        发送
      </button>
    </div>

    <div class="content">
      <div class="card">
        <div class="section-title">反馈类型</div>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="bug" checked>
            <span class="radio-text">🐛 功能问题</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="suggestion">
            <span class="radio-text">💡 改进建议</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="complaint">
            <span class="radio-text">😡 投诉</span>
          </label>
        </div>
      </div>

      <div class="card">
        <div class="section-title">详细描述</div>
        <textarea
          v-model="feedbackContent"
          placeholder="请描述您遇到的问题或建议..."
          @input="checkFeedbackForm"
        ></textarea>
        <div class="char-count">{{ charCount }}</div>
      </div>

      <div class="card">
        <div class="section-title">添加截图（可选）</div>
        <div class="image-upload">
          <div class="upload-btn" @click="uploadImage">
            <span class="upload-icon">+</span>
            <span class="upload-text">添加图片</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-title">联系方式（可选）</div>
        <input
          type="text"
          v-model="contactInfo"
          placeholder="手机/邮箱"
        >
      </div>
    </div>

    <!-- 反馈成功弹窗 -->
    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content">
        <div class="modal-icon">✅</div>
        <div class="modal-title">感谢您的反馈！</div>
        <div class="modal-message">我们会在3个工作日内处理</div>
        <button class="modal-btn" @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* 统一顶部导航栏样式 */
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

.submit-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  padding: 8px;
  min-width: 50px;
}

.submit-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.radio-text {
  font-size: 15px;
}

/* 文本输入区域 */
textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  margin-bottom: 8px;
  font-size: 14px;
}

textarea:focus {
  border-color: #1890FF;
  outline: none;
}

/* 图片上传区域 */
.image-upload {
  display: flex;
  gap: 8px;
}

.upload-btn {
  width: 100%;
  height: 80px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

/* 联系方式输入框 */
input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

input[type="text"]:focus {
  border-color: #1890FF;
  outline: none;
}

/* 字符计数 */
.char-count {
  text-align: right;
  color: #999;
  font-size: 12px;
}

/* 反馈成功弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.modal-content {
  background: white;
  width: 80%;
  max-width: 300px;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.modal-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.modal-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.modal-btn {
  padding: 10px 0;
  border-radius: 6px;
  border: none;
  background: #1890FF;
  color: white;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
}
</style>