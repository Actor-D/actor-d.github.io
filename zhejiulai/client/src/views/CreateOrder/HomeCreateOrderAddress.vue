<script setup>
import Address from "@/components/Home/HomeCreateOrder/HomeCreateOrderAddress.vue";
</script>
<template>
  <div id="app">
    <Address/>
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