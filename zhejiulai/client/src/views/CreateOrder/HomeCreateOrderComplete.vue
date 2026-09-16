<script setup>
import Complete from "@/components/Home/HomeCreateOrder/HomeCreateOrderComplete.vue";
</script>
<template>
  <div id="app">
    <Complete/>
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