<script>
import HomeHeader from "@/components/Navigation/HomeHeader.vue";
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
import HomeMyPage from "@/components/Home/HomeMyPage/HomeMyPage.vue";
export default {
  components: {
    HomeHeader,
    HomeFooter,
    HomeMyPage
  }
}
</script>
<template>
  <div id="app">
    <HomeHeader/>
    <HomeMyPage />
    <HomeFooter />
    <div class="copyright">
      🔒账号保护中（最后登录：今天11:30）
      <br>
      ⚠️非常用设备登录会要求验证
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