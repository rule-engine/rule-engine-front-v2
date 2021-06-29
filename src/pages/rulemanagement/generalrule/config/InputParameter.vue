<template>
  <div>
    <a-form layout="inline">
      <a-form-item label="名称/编码">
        <a-input v-model="query.query.nameOrCode"/>
      </a-form-item>

      <a-form-item>
        <a-button type="primary">
          搜索
        </a-button>
      </a-form-item>
    </a-form>

    <br>

    <a-button type="primary">新建</a-button>
    <br> <br>
    <standard-table
        rowKey="id"
        style="clear: both"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
    >

      <div slot="action">
        <a style="margin-right: 8px">
          <a-icon type="eye"/>
          查看
        </a>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            更多
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-icon type="edit"/>
              编辑
            </a-menu-item>
            <a-menu-item>
              <a-icon type="delete"/>
              删除
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </standard-table>

  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";

export default {
  name: "InputParameter",
  components: {StandardTable},
  data() {
    return {
      loading: false,
      selectedRows: [],
      columns: [
        {
          title: '名称',
          width: '180px',
          dataIndex: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code',
          width: '180px',
        },
        {
          title: '操作',
          width: '220px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      dataSource: [
        {
          id: 1,
          name: '名字',
          code: 'name',
        },
        {
          id: 2,
          name: '年龄',
          code: 'age',
        },
      ],
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
          nameOrCode: null,
        }
      },
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
