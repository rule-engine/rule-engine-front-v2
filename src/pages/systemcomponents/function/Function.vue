<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form ref="searchForm" :form="form" layout="inline">
        <a-form-item label="名称">
          <a-input v-model="query.query.name"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="loadFunctionList()">
            搜索
          </a-button>
          <a-button style="margin-left: 10px"  type="reset" @click="reset()">
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider dashed/>
      <a-space class="operator">
        <a-button @click="addFunctionForm" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </a-space>
    </a-card>

    <a-card>
      <standard-table
              rowKey="id"
              style="clear: both"
              :columns="tableData"
              :dataSource="dataSource"
              @change="onChange"
              :selectedRows.sync="selectedRows"
              :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="editMethod(record)">
            <a-icon type="edit"/>
            查看
          </a>
          <a style="margin-right: 8px" @click="deleteUser(record)">
            <a-icon type="delete"/>
            测试
          </a>
        </div>
      </standard-table>
    </a-card>

  </page-layout>
</template>



<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'

  import {functionList} from '@/services/function'

  const columns = [
    {
      title: '编号',
      width: '120px',
      dataIndex: 'id'
    },
    {
      title: '名称',
      width: '200px',
      dataIndex: 'name'
    },
    {
      title: '执行器',
      dataIndex: 'executor',
      width: '240px',
    },
    {
      title: '返回值类型',
      width: '200px',
      dataIndex: 'returnValueType',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '180px',
      sorter: true
    },
    {
      title: '操作',
      width: '140px',
      scopedSlots: {customRender: 'action'}
    }
  ];

  export default {
    name: "Function",
    components: {PageLayout,StandardTable},

    data() {
      return {
        run: {
          dialogFormVisible: false,
          form: {
            id: null,
            name: null,
            function: {
              paramValues: []
            },
            returnValueType: null,
            output: null
          }
        },
        dialogFormVisible: false,
        form: {
          name: null,
          returnValueType: null,
          description: null,
          executor: null,
          paramsJson: null
        },
        tableData: columns,
        selectedRows: [],
        dataSource : [],
        loading: true,
        query: {
          orders: [
            {
              columnName: 'create_time',
              desc: true
            }
          ],
          page: {
            pageIndex: 1,
            pageSize: 10,
            total: 0
          },
          query: {
            name:''
          }
        },
      }
    },
    methods: {
      loadFunctionList(){
        this.loading = true;
        const _this = this;
        functionList(this.query).then(res => {
          console.log(res.data)
          const resp = res.data;
          if (resp.code ===200){
            _this.dataSource = resp.data.rows
            _this.query.page = resp.data.page
          }else {
            _this.dataSource = []
          }
        })
      },
      onChange(pagination) {
        if (pagination) {
          this.query.page.pageIndex = pagination.current
          this.query.page.pageSize = pagination.pageSize
        }
        this.loadFunctionList();
      },
      addFunctionForm() {
        alert("尽情期待");
      },
      test(row) {
        this.clearValidate();
        this.run.form.returnValueType = row.returnValueType;
        this.run.form.id = row.id;
        this.run.form.name = row.name;
        this.run.form.function.paramValues = Array.from(row.params).map(m => ({
          "code": m.code,
          "name": m.name,
          "value": undefined,
          "valueType": m.valueType,
        }));
        this.run.dialogFormVisible = true;
        this.run.form.output = null;
      },
      clearValidate() {
        let ref = this.$refs['runAddForm'];
        if (ref != null) {
          ref.clearValidate();
        }
      },
      reset() {
        this.query.query.name  = ''
        this.loadFunctionList();
      },
      // list() {
      //   this.loading = true;
      //   this.$axios.post("/ruleEngine/function/list", {
      //     "page": {
      //       "pageSize": this.page.pageSize,
      //       "pageIndex": this.page.pageIndex
      //     },
      //     "query": this.search.form,
      //     "orders": [
      //       {
      //         "columnName": "id",
      //         "desc": true
      //       }
      //     ]
      //   }).then(res => {
      //     if (res.data != null) {
      //       this.tableData = res.data.rows;
      //
      //       this.page.total = res.data.page.total;
      //     } else {
      //       this.tableData = [];
      //     }
      //     this.loading = false;
      //   }).catch(function (error) {
      //     console.log(error);
      //   });
      // }
    },
    mounted() {
      this.loadFunctionList();
    }
  }
</script>

<style scoped>
.search-form {
  margin-bottom: 24px;
}

</style>
