<script setup>
import Register from "@/components/FrontPage/FrontPageContent/FrontPageContentRegister.vue";
</script>
<template>
  <div id="app">
    <Register />
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