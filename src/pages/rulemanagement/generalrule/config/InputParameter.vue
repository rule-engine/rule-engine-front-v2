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

    <a-button type="primary" @click="this.add.visible=true">新建</a-button>
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

    <!--   新建参数-->
    <a-modal
        title="新建参数"
        :visible="add.visible"
        :zIndex="999999999"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="handleAddOk()"
        @cancel="handleAddCancel()">
      <template>
        <a-form-model ref="addWorkspace" :model="add.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="参数名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入参数名称"/>
          </a-form-model-item>
          <a-form-model-item label="参数编码" has-feedback prop="code">
            <a-input v-model="add.form.code" placeholder="请输入参数编码"/>
          </a-form-model-item>
          <a-form-model-item label="参数类型">
            <a-select v-model="add.form.type" placeholder="请选择数据类型" prop="type">
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="参数值描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";

export default {
  name: "InputParameter",
  components: {StandardTable},
  data() {
    return {
      add: {
        visible: true,
        confirmLoading: false,
        //表单数据
        form: {
          name: "",
          code: "",
          description: "",
          type: ""
        },
      },
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入参数名称"},
        code: {min: 1, trigger: ['change', 'blur'], message: "请输入参数编码", required: true},
        description: {trigger: ['change', 'blur'], required: false, message: ""},
        type: {trigger: ['change', 'blur'], required: true, message: "请选择参数类型"}
      },
      loading: false,
      selectedRows: [],
      columns: [
        {
          title: '名称',
          width: '120px',
          dataIndex: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code',
          width: '120px',
        },
        {
          title: '操作',
          key: 'operation',
          width: '150px',
          scopedSlots: {customRender: 'action'},
        },
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
  methods: {
    handleAddOk() {

    },
    handleAddCancel() {
      this.add.visible = false
    }
  }
}
</script>

<style scoped>

</style>
