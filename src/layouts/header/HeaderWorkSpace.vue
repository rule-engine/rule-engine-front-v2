<template>
  <div class="header-work-space">
    <a-dropdown class="lang header-item">
      <div class="hover">
        <a-icon :type="loading?'loading':'laptop'"/>
        {{ currentWorkSpace.name }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item @click.stop="onClickSearch($event)">
          <a-input-search :loading="searchLoading" v-model="query.query.name" :allowClear="true"
                          @click.native="onClickSearch($event)"
                          @change.self="changeSearch($event)"
                          placeholder="请输入空间名称"
                          style="width: 180px"
                          @search="submitSearch"
          />
        </a-menu-item>
        <a-menu-item @click="changeWorkSpace" v-for=" workSpace in workSpaceList" :key="workSpace.id">{{
            workSpace.name
          }}
        </a-menu-item>
        <a-empty v-if="workSpaceList.length===0" description="没有找到工作空间" :imageStyle="{height:'30px',width:'50px'}"/>
      </a-menu>

    </a-dropdown>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {change, list} from '@/services/workspace'

export default {
  name: 'HeaderWorkSpace',
  data() {
    return {
      loading: true,
      searchLoading: false,
      workSpaceList: [],
      query: {
        orders: [
          {
            columnName: 'createTime',
            desc: true
          }
        ],
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        query: {
          code: '',
          name: ''
        }
      }
    }
  }, computed: {
    ...mapGetters('workspace', ['currentWorkSpace']),
  },
  created() {
    this.workSpaceList.push(this.currentWorkSpace)
    this.loadList()

  },
  methods: {
    loadList() {
      var _this = this
      list(this.query).then(res => {
        let resp = res.data.data
        if (resp) {
          _this.workSpaceList = resp.rows
          _this.query.page.total = resp.page.total
        } else {
          _this.workSpaceList = []
          _this.query.page.total = 0
        }
      }).finally(() => {
        _this.loading = false
        _this.searchLoading = false
      })
    },
    changeWorkSpace(space) {
      this.loading = true
      var _this = this
      let target = this.workSpaceList.find(e => e.id === space.key)

      change({id: target.id}).then(res => {
        if (res.data.code === 200) {
          _this.$store.commit("workspace/setWorkSpace", target)
        }
      }).finally(() => {
        _this.loading = false
        _this.$router.go(0)
      })

    },
    onClickSearch(e) {
      // this.loading = true
      if (e.domEvent) {
        e.domEvent.stopPropagation()
      } else {
        e.stopPropagation();
      }

    }, changPage(pageNumber) {
      console.log('Page: ', pageNumber);
    },
    submitSearch() {
      this.searchLoading = true
      this.loadList()
    }
    , changeSearch() {
      // console.log('Page: ', e);
      // if (e.type === 'change') {
      //   e.stopPropagation();
      // }
      if (!this.query.query.name) this.submitSearch()
      // ()=>{if (!this.query.query.name) this.submitSearch()}

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
