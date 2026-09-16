<script>
import FeedBack from "@/components/Home/HomeMyPage/HomeMyPageList/HomeMyPageListFeedBack.vue";
export default {
  components: {
      FeedBack
  }
}
</script>
<template>
  <div id="app">
    <FeedBack/>
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