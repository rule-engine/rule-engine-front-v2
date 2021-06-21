<template>
  <div class="header-work-space">
    <a-dropdown class="lang header-item">
      <div class="hover">
        <a-icon type="laptop"/>
        {{ currentWorkSpace.name }}
      </div>
      <a-menu @click="changeWorkSpace" slot="overlay">
        <a-menu-item v-for=" workSpace in workSpaceList" :key="workSpace.wsId">{{ workSpace.name }}
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'HeaderWorkSpace',
  data() {
    return {
      workSpaceList: [
        {
          wsId: 0,
          name: '默认工作空间'
        }, {
          wsId: 1,
          name: '工作空间一'
        }, {
          wsId: 2,
          name: '工作空间二'
        }, {
          wsId: 3,
          name: '工作空间三'
        }]
    }
  }, computed: {
    ...mapGetters('workspace', ['currentWorkSpace']),
  },
  methods: {
    changeWorkSpace(space) {
      this.$store.commit('workspace/setWorkSpace', this.workSpaceList.find(e => e.wsId === space.key))
      this.$router.go(0)

    }
  }
}
</script>

<style lang="less">
.header-work-space {
  .hover {
    cursor: pointer;
  }

}
</style>
