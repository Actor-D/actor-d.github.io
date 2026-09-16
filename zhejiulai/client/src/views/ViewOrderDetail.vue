<script setup>
import ViewOrderDetail from "@/components/Home/HomeViewOrder/HomeViewOrderList/HomeViewOrderListDetail.vue";
</script>
<template>
  <div id="app">
    <ViewOrderDetail />
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