<script>
import Setting from "@/components/Home/HomeMyPage/HomeMyPageList/HomeMyPageListSetting.vue";
export default {
  components: {
      Setting
  }
}
</script>
<template>
  <div id="app">
    <Setting/>
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