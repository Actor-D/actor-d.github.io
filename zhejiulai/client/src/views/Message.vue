<script>
import HomeHeader from "@/components/Navigation/HomeHeader.vue";
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
import Message from "@/components/Home/HomeMessagePage/HomeMessagePageList.vue";
export default {
  components: {
    HomeHeader,
    HomeFooter,
    Message
  }
}
</script>
<template>
  <div id="app">
    <HomeHeader/>
    <Message />
    <HomeFooter />
    </div>
</template>

<style scoped>
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