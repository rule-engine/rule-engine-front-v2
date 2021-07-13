<template>
  <div>
    <Definition v-if="currentPage===1"></Definition>
    <Config v-if="currentPage===2"></Config>
    <Publish v-if="currentPage===3"></Publish>
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
    }
  }
}
</script>

<style scoped>

</style>
