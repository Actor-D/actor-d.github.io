<script>
import Info from "@/components/Home/HomeCreateOrder/HomeCreateOrderInfo.vue";
export default {
  components: {
    Info
  }
}
</script>
<template>
  <div id="app">
    <Info/>
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