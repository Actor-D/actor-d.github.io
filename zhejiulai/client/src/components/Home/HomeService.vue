<template>
  <div class="customer-service">
    <!-- 客服主内容区 -->
    <div class="main-content">
      <!-- 客服头部 -->
      <div class="header">
        <h1>在线客服</h1>
        <div class="role-tabs">
          <button
            v-for="role in roles"
            :key="role.value"
            :class="{ active: currentRole === role.value }"
            @click="currentRole = role.value"
          >
            {{ role.label }}
          </button>
        </div>
      </div>

      <!-- 消息展示区域 -->
      <div class="messages" ref="messagesContainer">
        <transition-group name="message-list" tag="div">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="[message.sender, message.sender === 'system' ? 'system' : '']"
          >
            <div class="avatar" v-if="message.sender !== 'system'">
              <span>{{ getAvatarText(message.sender) }}</span>
            </div>
            <div class="message-content">
              <transition :name="message.sender === 'system' ? 'fade' : 'slide'">
                <div class="bubble">{{ message.content }}</div>
              </transition>
              <div class="timestamp">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入您的问题..."
          class="input-box"
        />
        <button @click="sendMessage" class="send-button">
          <span>发送</span>
          <div class="send-icon">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerService',
  data() {
    return {
      currentRole: 'user',
      newMessage: '',
      messages: [
        {
          content: '您好！这里是浙就来校园配送客服中心，请问有什么可以帮您？',
          sender: 'system',
          timestamp: new Date()
        }
      ],
      roles: [
        { value: 'user', label: '用户' },
        { value: 'delivery', label: '配送员' },
        { value: 'admin', label: '管理员' }
      ],
      colors: {
        user: '#1890FF',
        delivery: '#FFA940',
        admin: '#8C8C8C'
      }
    }
  },
  computed: {
    roleColor() {
      return this.colors[this.currentRole]
    }
  },
  methods: {
    sendMessage() {
      if (!this.newMessage.trim()) return

      this.messages.push({
        content: this.newMessage,
        sender: this.currentRole,
        timestamp: new Date()
      })

      setTimeout(() => {
        this.messages.push({
          content: '已收到您的消息，我们会尽快为您处理！',
          sender: 'system',
          timestamp: new Date()
        })
        this.scrollToBottom()
      }, 1000)

      this.newMessage = ''
      this.$nextTick(this.scrollToBottom)
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },
    getAvatarText(sender) {
      const texts = { user: '客', delivery: '配', admin: '管' }
      return texts[sender]
    }
  }
}
</script>

<style scoped>
.customer-service {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", sans-serif;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header {
  padding: 16px;
  background-color: #1890FF;
  color: white;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 18px;
  margin: 0 0 10px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.role-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.role-tabs button {
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateZ(0);
}

.role-tabs button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.role-tabs button.active {
  background-color: white;
  color: #1890FF;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 消息区域样式 */
.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f5f5;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(0, 150, 255, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255, 169, 64, 0.05) 0%, transparent 20%);
  background-size: 200% 200%;
  animation: gradientBG 15s ease infinite;
}

.message {
  display: flex;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.message.system .bubble {
  background-color: #e6e6e6;
  color: #666;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
  background-color: #1890FF;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.message:hover .avatar {
  transform: scale(1.1);
}

.message.delivery .avatar {
  background-color: #FFA940;
}

.message.admin .avatar {
  background-color: #8C8C8C;
}

.message-content {
  max-width: 70%;
}

.bubble {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  background-color: white;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.message:hover .bubble {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.message.user .bubble {
  background-color: #1890FF;
  color: white;
  border-top-left-radius: 0;
}

.message.delivery .bubble {
  background-color: #FFA940;
  color: white;
  border-top-left-radius: 0;
}

.message.admin .bubble {
  background-color: #8C8C8C;
  color: white;
  border-top-left-radius: 0;
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.message:hover .timestamp {
  opacity: 1;
}

/* 输入区域样式 */
.input-area {
  padding: 12px 16px;
  background-color: white;
  display: flex;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.input-box {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: "PingFang SC", sans-serif;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-box:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.send-button {
  margin-left: 10px;
  padding: 10px 16px;
  background-color: #1890FF;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-family: "PingFang SC", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
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

.send-button:hover {
  background-color: #40a9ff;
  padding-right: 12px;
}

.send-button:hover .send-icon {
  width: 24px;
  margin-left: 8px;
  opacity: 1;
  transform: translateX(0);
}

.send-button:hover span {
  transform: translateX(-5px);
}

/* 动画 */
@keyframes gradientBG {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0 0;
  }
}

</style>