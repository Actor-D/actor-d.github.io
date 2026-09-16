<template>
  <div class="customer-service">
    <!-- 客服主内容区 -->
    <div class="main-content">
      <!-- 客服头部 -->
      <div class="header">
        <button @click="goBack" class="back-btn">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
        </button>
        <h1>AI智能客服</h1>
        <div class="action-buttons">
          <button @click="clearHistory" class="clear-btn">
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
            清空对话
          </button>
        </div>
      </div>

      <!-- 消息展示区域 -->
      <div class="messages" ref="messagesContainer">
        <div v-if="loadingHistory" class="loading-indicator">
          <div class="spinner"></div>
          加载对话中...
        </div>

        <transition-group name="message-list" tag="div">
          <div
            v-for="(message, index) in messages"
            :key="message.id || index"
            class="message"
            :class="message.role"
          >
            <div class="avatar" v-if="message.role !== 'system'">
              <div class="avatar-bg" :class="message.role">
                <span>{{ message.role === 'user' ? '我' : 'AI' }}</span>
              </div>
            </div>
            <div class="message-content">
              <div class="bubble" v-html="formatMessage(message.content)"></div>
              <div class="timestamp">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </transition-group>

        <div v-if="isTyping" class="message assistant">
          <div class="avatar">
            <div class="avatar-bg assistant">
              <span>AI</span>
            </div>
          </div>
          <div class="message-content">
            <div class="bubble typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入您的问题..."
          class="input-box"
          :disabled="isSending"
        />
        <button @click="sendMessage" class="send-button" :disabled="isSending || !newMessage.trim()">
          <span>发送</span>
          <div class="send-icon">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decoration deco-1"></div>
    <div class="decoration deco-2"></div>
    <div class="decoration deco-3"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const newMessage = ref('');
const messages = reactive([]);
const sessionId = ref(null);
const isSending = ref(false);
const isTyping = ref(false);
const loadingHistory = ref(true);
const messagesContainer = ref(null);

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 初始化聊天会话
const initializeChatSession = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/chat/session', {}, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      sessionId.value = response.data.session_id;
      loadChatHistory();
    }
  } catch (error) {
    console.error('初始化会话失败:', error);
    messages.push({
      role: 'system',
      content: '会话初始化失败，请刷新页面重试'
    });
    loadingHistory.value = false;
  }
};

// 加载聊天历史
const loadChatHistory = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/chat/history', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      messages.splice(0, messages.length, ...response.data.messages);
      scrollToBottom();
    }
    loadingHistory.value = false;
  } catch (error) {
    console.error('加载历史消息失败:', error);
    messages.push({
      role: 'system',
      content: '加载历史消息失败'
    });
    loadingHistory.value = false;
  }
};

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: newMessage.value,
    timestamp: new Date().toISOString()
  };

  messages.push(userMessage);
  newMessage.value = '';
  scrollToBottom();

  isSending.value = true;
  isTyping.value = true;

  try {
    const response = await axios.post('http://localhost:5000/api/chat/send', {
      content: userMessage.content
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      const aiMessage = {
        id: response.data.message_id,
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString()
      };

      messages.push(aiMessage);
    } else {
      messages.push({
        role: 'system',
        content: '获取回复失败，请重试'
      });
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.push({
      role: 'system',
      content: '网络错误，请检查连接'
    });
  } finally {
    isSending.value = false;
    isTyping.value = false;
    scrollToBottom();
  }
};

// 清空历史
const clearHistory = async () => {
  if (isSending.value) return;

  try {
    isSending.value = true;
    await axios.delete('http://localhost:5000/api/chat/clear', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    // 清空本地消息
    messages.splice(0, messages.length);
    // 重新加载历史
    loadChatHistory();
  } catch (error) {
    console.error('清空历史失败:', error);
    messages.push({
      role: 'system',
      content: '清空对话失败'
    });
  } finally {
    isSending.value = false;
  }
};

// 格式化消息内容
const formatMessage = (content) => {
  return content.replace(/\n/g, '<br>');
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const beijingHours = date.getUTCHours() + 8;
  const adjustedHours = beijingHours >= 24 ? beijingHours - 24 : beijingHours;

  const hours = adjustedHours.toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

onMounted(() => {
  initializeChatSession();
});
</script>

<style scoped>
.customer-service {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background-color: #f8f9ff;
  position: relative;
  overflow: hidden;
}

/* 装饰元素 */
.decoration {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  filter: blur(40px);
  opacity: 0.7;
}

.deco-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #1890FF, #6dc7ff);
  top: -100px;
  right: -100px;
  animation: float 15s infinite ease-in-out;
}

.deco-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #FFA940, #ffc97c);
  bottom: 50px;
  left: -50px;
  animation: float 12s infinite ease-in-out reverse;
}

.deco-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #52c41a, #95de64);
  top: 40%;
  left: 30%;
  animation: float 18s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-20px, 20px);
  }
  50% {
    transform: translate(10px, -15px);
  }
  75% {
    transform: translate(-15px, -10px);
  }
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  margin: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.header {
  padding: 16px 20px;
  background: linear-gradient(90deg, #1890FF, #40a9ff);
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.header h1 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.clear-btn {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.clear-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  margin-right: 8px;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 消息区域样式 */
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fafbff;
  position: relative;
  z-index: 1;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
  font-size: 15px;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(24, 144, 255, 0.1);
  border-radius: 50%;
  border-top-color: #1890FF;
  margin-right: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.message {
  display: flex;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.message.system .bubble {
  background-color: #f0f7ff;
  color: #1890FF;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  box-shadow: 0 3px 8px rgba(24, 144, 255, 0.1);
  text-align: center;
  margin: 15px auto;
  max-width: 85%;
  border: 1px solid rgba(24, 144, 255, 0.15);
}

.avatar {
  margin-right: 12px;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.avatar-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.message:hover .avatar-bg {
  transform: scale(1.1);
}

.avatar-bg.user {
  background: linear-gradient(135deg, #1890FF, #40a9ff);
}

.avatar-bg.assistant {
  background: linear-gradient(135deg, #FFA940, #ffc069);
}

.message-content {
  max-width: 75%;
  transition: all 0.3s ease;
}

.bubble {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.message:hover .bubble {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.message.user .bubble {
  background: linear-gradient(135deg, #1890FF, #40a9ff);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .bubble {
  background: linear-gradient(135deg, #fff8e6, #ffffff);
  color: #333;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(255, 169, 64, 0.15);
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  opacity: 0.8;
  transition: all 0.3s ease;
  text-align: right;
}

.message.assistant .timestamp {
  text-align: left;
}

.message:hover .timestamp {
  opacity: 1;
  color: #666;
}

/* 输入区域样式 */
.input-area {
  padding: 16px 20px;
  background-color: white;
  display: flex;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  border-radius: 0 0 20px 20px;
}

.input-box {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #e6f7ff;
  border-radius: 16px;
  font-size: 15px;
  font-family: "PingFang SC", sans-serif;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(24, 144, 255, 0.1);
  background: #fafbff;
}

.input-box:focus {
  border-color: #91d5ff;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(24, 144, 255, 0.15);
}

.send-button {
  margin-left: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #1890FF, #40a9ff);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 500;
  font-family: "PingFang SC", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.send-button:disabled {
  background: linear-gradient(135deg, #bfbfbf, #d9d9d9);
  cursor: not-allowed;
  box-shadow: none;
}

.send-button span {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.send-icon {
  width: 0;
  height: 24px;
  margin-left: 0;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-10px);
}

.send-icon svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.send-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  padding-right: 20px;
}

.send-button:not(:disabled):hover .send-icon {
  width: 24px;
  margin-left: 10px;
  opacity: 1;
  transform: translateX(0);
}

.send-button:not(:disabled):hover span {
  transform: translateX(-5px);
}

/* 打字指示器 */
.typing-indicator {
  background-color: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-radius: 18px;
  border: 1px solid rgba(24, 144, 255, 0.15);
}

.typing-indicator span {
  width: 9px;
  height: 9px;
  background-color: #1890FF;
  border-radius: 50%;
  display: inline-block;
  margin: 0 3px;
  animation: bounce 1.3s linear infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

/* 消息列表过渡动画 */
.message-list-enter-active,
.message-list-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message-list-enter-from,
.message-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.message-list-move {
  transition: transform 0.7s ease;
}

/* 滚动条美化 */
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: rgba(24, 144, 255, 0.05);
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(24, 144, 255, 0.2);
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: rgba(24, 144, 255, 0.3);
}
</style>