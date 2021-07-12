<template>
  <div>
    <a-form layout="inline">
      <a-form-model-item label="名称">
        <a-input
            v-model="query.query.name"/>
      </a-form-model-item>
      <a-form-model-item label="编码">
        <a-input
            v-model="query.query.code"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitSearch()">
          搜索
        </a-button>
        <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
          重置
        </a-button>
      </a-form-model-item>
    </a-form>

    <br>

    <a-button type="primary" @click="add.visible=true">新建</a-button>
    <br> <br>
    <standard-table
        :loading="loading"
        rowKey="id"
        style="clear: both"
        :columns="columns"
        :dataSource="dataSource"
        @change="onPageChange"
        :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
    >
      <div slot="valueType" slot-scope="{record}">
        <a-tag color="cyan">{{ getValueTypeName(record.valueType) }}</a-tag>
      </div>

      <div slot="action" slot-scope="{record}">
        <a style="margin-right: 8px" @click="info(record.id)">
          <a-icon type="edit"/>
          编辑
        </a>
        <a-popconfirm
            title="你确定要删除这个变量吗"
            ok-text="是"
            cancel-text="不了"
            @confirm="deleteById(record.id)"
        >
          <a>
            <a-icon type="delete"/>
            删除
          </a>
        </a-popconfirm>

      </div>
    </standard-table>

    <!--   新建变量-->
    <a-modal
        title="新建变量"
        :visible="add.visible"
        :zIndex="1000"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="handleAddOk('addVariable')"
        @cancel="handleAddCancel('addVariable')">
      <template>
        <a-form-model ref="addVariable" :model="add.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="变量名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入变量名称"/>
          </a-form-model-item>
          <a-form-model-item label="变量值类型" prop="valueType">
            <a-select v-model="add.form.valueType" placeholder="变量值类型">
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <div>
            <a-form-model-item label="变量值" has-feedback prop="value">
              <a-input v-model="add.form.value" placeholder="请输入变量值"
                       v-if="add.form.valueType==='STRING' || add.form.valueType==='NUMBER'"/>
              <a-select v-model="add.form.value" placeholder="选择值" v-else-if="add.form.valueType==='BOOLEAN'">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-date-picker :mode="'time'" :format="'YYYY-MM-DD hh:mm:ss'" :locale="locale" v-model="add.date"
                             v-else-if="add.form.valueType==='DATE'"/>
              <a-input v-model="add.form.value" type="textarea" placeholder="变量值"
                       v-else-if="add.form.valueType==='COLLECTION'"/>
              <a-input v-model="add.form.value" placeholder="请输入变量值" disabled
                       v-else/>
            </a-form-model-item>

          </div>
          <a-form-model-item label="变量值描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>
    <!--   编辑变量-->
    <a-modal
        title="编辑变量"
        :visible="update.visible"
        :zIndex="1000"
        :confirm-loading="update.confirmLoading"
        :width="700"
        @ok="handleUpdateOk('updateVariable')"
        @cancel="handleUpdateCancel('updateVariable')">
      <template>
        <a-form-model ref="updateVariable" :model="update.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="变量名称" has-feedback prop="name">
            <a-input v-model="update.form.name" placeholder="请输入变量名称"/>
          </a-form-model-item>
          <a-form-model-item label="变量编码" has-feedback prop="code">
            <a-input v-model="update.form.code" placeholder="请输入变量编码" disabled/>
          </a-form-model-item>
          <a-form-model-item label="变量值类型" prop="valueType">
            <a-select v-model="update.form.valueType" placeholder="变量值类型" disabled>
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="变量描述" has-feedback prop="description">
            <a-input v-model="update.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {addVariable, listVariable, update, get, deleteById} from "@/services/variable";
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

export default {
  name: "Variable",
  components: {StandardTable},
  props: {
    dataId: {
      type: Number,
      required: true
    },
    dataType: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      locale,
      add: {
        visible: false,
        confirmLoading: false,
        date: undefined,
        //表单数据
        form: {
          value: undefined,
          name: undefined,
          type: 2,
          description: undefined,
          valueType: undefined,
          dataId: this.dataId,
          dataType: this.dataType
        },
      }
      , update: {
        visible: false,
        confirmLoading: false,
        //表单数据
        form: {
          value: undefined,
          id: "",
          name: "",
          code: "",
          description: "",
          valueType: undefined,
          dataId: this.dataId,
          dataType: this.dataType
        },
      },
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入变量名称"},
        value: {min: 1, trigger: ['change', 'blur'], message: "变量不能为空", required: true},
        description: {trigger: ['change', 'blur'], required: false, message: ""},
        valueType: {trigger: ['change', 'blur'], required: true, message: "请选择变量值类型"}
      },
      loading: true,
      selectedRows: [],
      columns: [
        {
          title: '名称',
          width: '80px',
          dataIndex: 'name'
        },
        {
          title: '值类型',
          dataIndex: 'valueType',
          width: '80px',
          scopedSlots: {customRender: 'valueType'},
        },
        {
          title: '值',
          dataIndex: 'value',
          width: '120px',
        },
        {
          title: '操作',
          key: 'operation',
          width: '140px',
          fixed: 'right',
          scopedSlots: {customRender: 'action'},
        },
      ],
      dataSource: [],
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
          dataId: this.dataId,
          dataType: this.dataType
        }
      },
    }
  },
  watch: {
    "add.form.valueType"() {
      this.add.form.value = undefined
      this.add.form.type = 2
    },
    "add.date"(newVal) {
      if (newVal) {
        this.add.form.value = newVal.format('YYYY-MM-DD hh:mm:ss');
      }
    }
  },
  created() {
    this.loadVariableList()
  },
  methods: {
    getValueTypeName(valueType) {
      switch (valueType) {
        case 'STRING':
          return '字符串'
        case 'NUMBER':
          return '数值'
        case 'COLLECTION':
          return '集合'
        case 'BOOLEAN':
          return '布尔'
        case 'DATE':
          return '日期'
      }
    },
    handleAddOk(formName) {
      const _this = this;
      this.add.visible = true;
      this.add.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addVariable(this.add.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success("添加成功！");
              _this.add.visible = false;
              _this.$refs[formName].resetFields();
              _this.loadVariableList();
            }
          }).finally(() => _this.add.confirmLoading = false)
        } else {
          console.log('error submit!!');
          _this.add.confirmLoading = false;
          return false;
        }
      });
    },
    handleAddCancel(formName) {
      this.$refs[formName].resetFields();
      this.add.visible = false
    }, handleUpdateOk(formName) {
      const _this = this;
      this.update.visible = true;
      this.update.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          update(this.update.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success("修改成功！");
              _this.update.visible = false;
              _this.$refs[formName].resetFields();
              _this.loadVariableList();
            }
          }).finally(() => _this.update.confirmLoading = false)
        } else {
          console.log('error submit!!');
          _this.update.confirmLoading = false;
          return false;
        }
      });
    }, handleUpdateCancel(formName) {
      this.$refs[formName].resetFields();
      this.update.visible = false
    },
    onPageChange(pagination, filters, sorter, {currentDataSource}) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      if (sorter) {
        this.query.orders[0].desc = (!sorter.order || sorter.order === 'ascend')
      }
      console.log(pagination, filters, sorter, currentDataSource)
      this.loadVariableList()
    }, submitSearch() {
      this.loadVariableList()
    },
    resetForm() {
      this.query.query.name = this.query.query.code = ''
      this.loadVariableList()
    },
    info(id) {
      let _this = this
      get({id: id}).then(res => {
        if (res.data.code === 200) {
          _this.update.form = res.data.data
          _this.update.visible = true
        }

      })
    },
    deleteById(id) {
      let _this = this
      deleteById({id: id}).then(res => {
        if (res.data.code === 200) {
          _this.loadVariableList()
        }
      })
    },
    loadVariableList() {
      this.loading = true
      const _this = this;
      listVariable(this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.loading = false
      })

    },
  }
}
</script>

<style scoped>

</style>
