<script setup>
import Pay from "@/components/Home/HomeCreateOrder/HomeCreateGoodPay.vue";
</script>
<template>
  <div id="app">
    <Pay/>
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