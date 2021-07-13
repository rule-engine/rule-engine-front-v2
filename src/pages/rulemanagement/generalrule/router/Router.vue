<template>
  <div>
    <Definition @choicePage="choicePage" :ruleId="ruleId" v-if="currentPage===1"></Definition>
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
      currentPage: null,
      ruleId: undefined,
    }
  }, mounted() {
    console.log("$router", this.$router)
    console.log("$route", this.$route)
    let query = this.$route.query
    let params = this.$route.params
    if (query.pageIndex) {
      this.currentPage = parseInt(query.pageIndex)
    }
    if (params.ruleId) {
      try {
        this.ruleId = parseInt(params.ruleId);
      } catch (e) {
        console.debug(e)
      }
    }
    // 刚进页面 查询到规则name
    let nameElement = document.getElementsByClassName('ant-tabs-tab-active')[0].getElementsByClassName('title')[0];
    nameElement.innerHTML = '规则(' + '啊啊啊' + ')';
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
