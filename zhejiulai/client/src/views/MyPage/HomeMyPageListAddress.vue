<script>
import Address from "@/components/Home/HomeMyPage/HomeMyPageList/HomeMyPageListAddress.vue";
export default {
  components: {
      Address
  }
}
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