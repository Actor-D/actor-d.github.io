<script setup>
import HomeHeader from "@/components/Navigation/HomeHeader.vue";
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
import HomeMyPage from "@/components/Home/HomeMyPage/HomeMyPage.vue";
import axios from 'axios';
import { ref, onMounted } from 'vue';

const created_at = ref('');
const loading = ref(false);
const error = ref(null);

const getRegistrationTime = async () => {
  try {
    loading.value = true;
    // 添加 token 存在性检查
    const token = sessionStorage.getItem('token');
    if (!token) {
      error.value = '请先登录';
      return;
    }

    const response = await axios.get('http://localhost:5000/api/user_profile', {
      headers: {
        'Authorization': `Bearer ${token}` // 确保格式正确
      }
    });

    if (response.data.success) {
      created_at.value = response.data.user.created_at;
    }
  } catch (err) {
    console.error('获取注册时间失败:', err);
    error.value = '无法获取注册时间信息';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getRegistrationTime();
});
</script>

<template>
  <div id="app">
    <HomeHeader/>
    <HomeMyPage />
    <HomeFooter />
    <div class="copyright">
      <template v-if="loading">加载中...</template>
      <template v-else-if="error">{{ error }}</template>
      <template v-else>
        🔒账号保护中（注册时间：{{ created_at }}）
        <br>
        ⚠️非常用设备登录会要求验证
      </template>
    </div>
  </div>
</template>

<style scoped>
.copyright {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 15px 0;
  line-height: 1.6;
}
@media (min-width: 1080px) {
    #app {
        width: 80%;
        margin: 0 auto;
    }
}

@media (max-width: 1080px) {
    #app {
        width:100%
    }
}
</style>