<template>
  <div>
    <Definition @choicePage="choicePage" v-if="currentPage===1"></Definition>
    <Config @choicePage="choicePage" :ruleId="ruleId" v-if="currentPage===2"></Config>
    <Publish @choicePage="choicePage" :ruleId="ruleId" v-if="currentPage===3"></Publish>
  </div>
</template>

<script>

import Definition from '../definition/Definition'
import Config from '../config/Config'
import Publish from '../publish/Publish'


export default {
  name: "Router",
  components: {Definition, Config, Publish},
  data() {
    return {
      currentPage: 1,
      ruleId: undefined,
    }
  }, mounted() {
    let query = this.$route.query
    if (query) {
      this.ruleId = parseInt(query.id);
      this.currentPage = parseInt(query.pageIndex)
    }
  }, methods: {
    choicePage(params) {
      this.currentPage = params.pageIndex
      this.ruleId = params.id
    }
  }
}
</script>

<style scoped>

</style>
