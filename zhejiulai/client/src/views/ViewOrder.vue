<script setup>
import HomeHeader from "@/components/Navigation/HomeHeader.vue";
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
import ViewOrder from "@/components/Home/HomeViewOrder/HomeViewOrderList.vue";
</script>
<template>
  <div id="app">
    <HomeHeader/>
    <ViewOrder />
    <div class="footer">
      <HomeFooter />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1080px) {
    #app {
        width: 80%;
        margin: 0 auto;
    }
    /* 让 footer 的宽度和位置与 #app 一致 */
    .footer {
      position: fixed;
      bottom: 0;
      width: 80%;
      left: 50%;
      transform: translateX(-50%);
    }
}

@media (max-width: 1080px) {
    #app {
        width: 100%;
    }
    /* 在移动端，footer 占满宽度 */
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
}
</style>