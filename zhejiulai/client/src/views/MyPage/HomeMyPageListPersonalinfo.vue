<script>
import Personalinfo from "@/components/Home/HomeMyPage/HomeMyPageList/HomeMyPageListPersonalinfo.vue";
export default {
  components: {
      Personalinfo
  }
}
</script>
<template>
  <div id="app">
    <Personalinfo/>
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