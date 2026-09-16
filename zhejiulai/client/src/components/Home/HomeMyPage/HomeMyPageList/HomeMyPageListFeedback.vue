<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const feedbackType = ref('bug')
const feedbackContent = ref('')
const contactInfo = ref('')
const showSuccessModal = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

// 字符计数
const charCount = computed(() => {
  return `${feedbackContent.value.length}/500`
})

// 提交按钮状态
const canSubmit = computed(() => {
  const validContent = feedbackContent.value.trim()
  return validContent.length >= 10 &&
      validContent.length <= 500 &&
      !isSubmitting.value
})

// 最小长度警告
const showMinLengthWarning = computed(() => {
  const validContent = feedbackContent.value.trim()
  return validContent.length > 0 && validContent.length < 10
})

// 提交反馈
const submitFeedback = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const token = sessionStorage.getItem('token')
    if (!token) {
      throw new Error('用户未登录')
    }

    const response = await axios.post('http://127.0.0.1:5000/api/feedback', {
      type: feedbackType.value,
      content: feedbackContent.value.trim(),
      contact_info: contactInfo.value.trim()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.success) {
      feedbackContent.value = ''
      contactInfo.value = ''
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
      }, 2000)
    } else {
      throw new Error(response.data.message || '提交失败')
    }
  } catch (err) {
    handleSubmissionError(err)
  } finally {
    isSubmitting.value = false
  }
}

// 错误处理
const handleSubmissionError = (err) => {
  if (err.response) {
    errorMessage.value = err.response.data?.message ||
        `服务器错误 (${err.response.status})`
  } else if (err.request) {
    errorMessage.value = '网络错误，请检查连接'
  } else {
    errorMessage.value = err.message || '请求发送失败'
  }

  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}
</script>

<template>
  <div class="page-container">
    <div class="header">
      <router-link to="/Home/MyPage" class="nav-back">
        <svg class="back-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
        </svg>
      </router-link>
      <h1>意见反馈</h1>
      <button
          class="submit-btn"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
          @click="submitFeedback"
      >
        {{ isSubmitting ? '提交中...' : '发送' }}
      </button>
    </div>

    <div class="content">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="card">
        <div class="section-title">反馈类型</div>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="bug">
            <span class="radio-text">🐛 功能问题</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="suggestion">
            <span class="radio-text">💡 改进建议</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="feedbackType" value="complaint">
            <span class="radio-text">😡 用户投诉</span>
          </label>
        </div>
      </div>

      <div class="card">
        <div class="section-title">详细描述</div>
        <textarea
            v-model="feedbackContent"
            placeholder="请描述具体问题和建议（10-500字）"
            maxlength="500"
        ></textarea>
        <div class="char-count">
          {{ charCount }}
          <span v-if="showMinLengthWarning" class="length-warning">
            （至少需要10个有效字符）
          </span>
        </div>
      </div>

      <div class="card">
        <div class="section-title">联系方式（可选）</div>
        <input
            type="text"
            v-model="contactInfo"
            placeholder="请输入手机/邮箱"
            maxlength="50"
        >
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content">
        <div class="modal-icon">✅</div>
        <div class="modal-title">反馈提交成功！</div>
        <div class="modal-message">我们将尽快处理您的反馈</div>
        <button class="modal-btn" @click="showSuccessModal = false">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持原有样式不变 */
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

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

input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.char-count {
  text-align: right;
  color: #999;
  font-size: 12px;
}

.error-message {
  color: #ff4d4f;
  padding: 8px 16px;
  background: #fff2f0;
  border-radius: 4px;
  margin: 12px;
  font-size: 14px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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

.length-warning {
  color: #ff4d4f;
  margin-left: 8px;
  font-size: 12px;
}
</style>