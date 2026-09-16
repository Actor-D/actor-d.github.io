<script setup>
import About from "@/components/Home/HomeMyPage/HomeMyPageList/HomeMyPageListAbout.vue";
</script>
<template>
  <div id="app">
    <About/>
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