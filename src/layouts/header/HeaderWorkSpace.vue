<template>
  <div class="header-work-space">
    <a-dropdown class="lang header-item">
      <div class="hover">
        <a-icon :type="loading?'loading':'laptop'"/>
        {{ currentWorkSpace.name }}
      </div>
      <a-menu @click="changeWorkSpace" slot="overlay">
        <a-menu-item v-for=" workSpace in workSpaceList" :key="workSpace.id">{{ workSpace.name }}
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {list} from '@/services/workspace'

export default {
  name: 'HeaderWorkSpace',
  data() {
    return {
      loading: true,
      workSpaceList: []
    }
  }, computed: {
    ...mapGetters('workspace', ['currentWorkSpace']),
  },
  created() {
    this.workSpaceList.push(this.currentWorkSpace)
    const query = {
      orders: [
        {
          columnName: 'createTime',
          desc: true
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 1024,
      },
      query: {
        code: '',
        name: ''
      }
    }
    var _this = this
    list(query).then(res => {
      let resp = res.data.data
      if (resp) {
        _this.workSpaceList = resp.rows
      }
    }).finally(()=>{
      this.loading = false
    })
  },
  methods: {
    changeWorkSpace(space) {
      this.loading = true
      let target = this.workSpaceList.find(e => e.id === space.key)
      this.$store.dispatch({type: 'workspace/SET_CURRENT_WORK_SPACE', target: target, context: this})


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
