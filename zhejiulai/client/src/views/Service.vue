<script>
import HomeFooter from "@/components/Navigation/HomeFooter.vue";
import HomeService from "@/components/Home/HomeService.vue";
export default {
  components: {
    HomeFooter,
    HomeService
  }
}
</script>
<template>
  <div id="app">
    <HomeService />
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