<template>
    <div class="chat-container">
        <!-- 左侧联系人列表 -->
        <div class="contact-list">
            <div class="search-box">
                <input type="text" placeholder="搜索消息" />
            </div>
            <div class="contacts">
                <div v-for="(contact, index) in contacts" :key="index" class="contact-item"
                    @click="selectContact(contact)">
                    <img :src="contact.avatar" class="avatar" />
                    <div class="contact-info">
                        <div class="name">{{ contact.name }}</div>
                        <div class="time">{{ contact.time }}</div>
                        <div class="message">{{ contact.message }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧聊天窗口 -->
        <div class="chat-window">
            <div class="chat-header">
                <router-link to="/Home/MessagePageList" class="back-button">
                    ←
                </router-link>
                <div class="header-content">
                    <div class="chat-title">{{ currentContact.name }}</div>
                    <div class="order-number">订单号：20250509</div>
                </div>
            </div>
            <div class="chat-messages">
                <div v-for="(record, index) in chatRecords" :key="index"
                    :class="['message-bubble', record.isMe ? 'me' : 'other']">
                    <div class="message-content">{{ record.message }}</div>
                    <div class="message-time">{{ record.time }}</div>
                </div>
            </div>
            <div class="chat-input">
                <div class="input-icons">
                    <span class="icon">😊</span>
                    <span class="icon">📷</span>
                </div>
                <input type="text" placeholder="输入消息..." v-model="newMessage" @keyup.enter="sendMessage" />
                <button class="send-button" @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const newMessage = ref('');
const contacts = ref([
  {
    name: "张三",
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    time: "15:39",
    message: "好的，我在这等您"
  },
  {
    name: "李四",
    avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    time: "14:20",
    message: "包裹已送达"
  },
  {
    name: "王五",
    avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    time: "13:45",
    message: "好的，收到"
  }
]);

const currentContact = ref({
  name: "张三",
  avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  time: "15:39",
  message: "好的，我在这等您"
});

const chatRecords = ref([
  {
    message: "您好，我已经到达取件点了",
    time: "15:35",
    isMe: true
  },
  {
    message: "我现在在基图门口",
    time: "15:36",
    isMe: true
  },
  {
    message: "好的，我马上过来",
    time: "15:36",
    isMe: false
  },
  {
    message: "我穿蓝色外套，背着黑色背包",
    time: "15:37",
    isMe: true
  },
  {
    message: "看到您了，正在走过来",
    time: "15:38",
    isMe: false
  },
  {
    message: "订单号是20250509对吧？",
    time: "15:38",
    isMe: true
  },
  {
    message: "对的，就是这个订单",
    time: "15:39",
    isMe: false
  },
  {
    message: "我已经把包裹放在推车上了",
    time: "15:40",
    isMe: false
  },
  {
    message: "好的，我检查一下物品",
    time: "15:41",
    isMe: true
  },
  {
    message: "物品齐全，谢谢！",
    time: "15:42",
    isMe: true
  },
  {
    message: "不客气，有问题随时联系",
    time: "15:42",
    isMe: false
  },
  {
    message: "截图工具\n复制到剪贴板的屏幕截图\n自动保存已关闭。\n\n标记和共享",
    time: "15:43",
    isMe: true
  },
  {
    message: "这是刚才的取件凭证截图",
    time: "15:43",
    isMe: true
  },
  {
    message: "收到，已确认",
    time: "15:44",
    isMe: false
  }
]);

function selectContact(contact) {
  currentContact.value = contact;
}

function sendMessage() {
  if (newMessage.value.trim()) {
    chatRecords.value.push({
      message: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    });
    newMessage.value = '';

    setTimeout(() => {
      chatRecords.value.push({
        message: "已收到您的消息",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      });
    }, 1000);
  }
}
</script>

<style scoped>
.chat-container {
    display: flex;
    height: 100vh;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background-color: #f5f5f5;
}

.contact-list {
    width: 300px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.search-box {
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
}

.search-box input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    transition: border-color 0.3s;
}

.search-box input:focus {
    border-color: #0084ff;
}

.contacts {
    flex: 1;
    overflow-y: auto;
}

.contact-item {
    display: flex;
    padding: 12px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: background-color 0.2s;
}

.contact-item:hover {
    background-color: #f8f8f8;
}

.contact-item.active {
    background-color: #e6f2ff;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
    border: 1px solid #f0f0f0;
}

.contact-info {
    flex: 1;
    min-width: 0;
}

.name {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 15px;
    color: #333;
}

.time {
    font-size: 12px;
    color: #999;
    float: right;
}

.message {
    font-size: 13px;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
}

.chat-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.back-button {
    background: none;
    border: none;
    font-size: 20px;
    color: #0084ff;
    cursor: pointer;
    padding: 5px 10px;
    margin-right: 10px;
    transition: all 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-button:hover {
    color: #0066cc;
    transform: translateX(-2px);
}

.header-content {
    flex: 1;
}

.chat-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.order-number {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
}

.chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: #f0f2f5;
    display: flex;
    flex-direction: column;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkEEjIZJ3QZ9QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAJUlEQVQ4y2NgGAWjYBSMglEwCkbBKBgFgw4wQjGjYBSMglEwCgYcAABgAAF1RZQ9AAAAAElFTkSuQmCC');
    background-repeat: repeat;
}

.message-bubble {
    max-width: 70%;
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 18px;
    position: relative;
    word-wrap: break-word;
    animation: fadeIn 0.3s ease-out;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-bubble.me {
    background-color: #0084ff;
    color: white;
    margin-left: auto;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.message-bubble.other {
    background-color: #fff;
    color: #333;
    margin-right: auto;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.message-bubble.me .message-content {
    color: #fff;
}

.message-bubble.other .message-content {
    color: #333;
}

.message-time {
    font-size: 11px;
    text-align: right;
    color: rgba(255, 255, 255, 0.7);
}

.message-bubble.other .message-time {
    color: #999;
}

.chat-input {
    display: flex;
    padding: 12px;
    border-top: 1px solid #e0e0e0;
    align-items: center;
    background-color: #fff;
}

.input-icons {
    display: flex;
    margin-right: 10px;
}

.icon {
    margin-right: 12px;
    cursor: pointer;
    font-size: 20px;
    color: #666;
    transition: transform 0.2s;
}

.icon:hover {
    color: #0084ff;
    transform: scale(1.1);
}

.chat-input input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    transition: border-color 0.3s;
}

.chat-input input:focus {
    border-color: #0084ff;
}

.send-button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
}

.send-button:hover {
    background-color: #0066cc;
    transform: translateY(-1px);
}

.send-button:active {
    transform: translateY(0);
}
</style>