<script setup>
import PageList from "@/components/Home/HomeMessagePage/HomeMessagePageList.vue";
</script>
<template>
  <div id="app">
    <PageList />
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