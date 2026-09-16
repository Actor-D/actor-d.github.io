<script>
import PageDetail from "@/components/Home/HomeMessagePage/HomeMessagePageDetail.vue";
export default {
  components: {
    PageDetail
  }
}
</script>
<template>
  <div id="app">
    <PageDetail />
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