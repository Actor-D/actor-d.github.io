<script>
import HomeHeader from "@/components/Navigation/HomeHeader.vue";
import HomePage from "@/components/Home/HomePage.vue";
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
export default {
  components: {
    HomeHeader,
    HomeFooter,
    HomePage
  }
}
</script>
<template>
  <div id="app">
    <HomeHeader/>
    <HomePage />
    <HomeFooter/>
  <div class="copyright">
      © 2024 浙就来校园配送平台 版权所有
      <br>
      浙ICP备XXXXXXXX号-X
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