<template>
  <page-layout>
    <a-card :bordered="false" style="margin-bottom: 24px;">
      <a-form layout="inline">
        <a-form-model-item label="名称">
          <a-input
              v-model="query.query.name"/>
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

      <a-divider dashed/>
      <a-space class="operator">
        <a-button @click="create" type="primary">新建</a-button>
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
          :scroll="{ x: 500 }"
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
          <a-tag color="cyan">
            ({{ getValueTypeName(record.valueType) }})
          </a-tag>
        </div>

        <div slot="value" slot-scope="{record}">
          {{ record.value }}
        </div>

        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="getFormula(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              title="你确定要删除这个变量吗"
              ok-text="是"
              cancel-text="不了"
              @confirm="deleteById(record)"
          >
            <a>
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>

        </div>
      </standard-table>
    </a-card>

    <a-modal
        :title="add.form.id===undefined?'新建表达式':'编辑表达式'"
        :visible="add.visible"
        :zIndex="1000"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="handleAddOk()"
        @cancel="handleAddCancel('addForm')">
      <template>
        <a-form-model ref="addForm" :model="add.form" :rules="add.rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 16}">
          <a-form-model-item label="名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入表达式名称"/>
          </a-form-model-item>
          <a-form-model-item label="返回类型" prop="valueType">
            <a-select v-model="add.form.valueType"
                      :disabled="add.form.id!==undefined"
                      placeholder="请输入返回值类型">
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="表达式" has-feedback prop="value">
            <a-textarea v-model="add.form.value" placeholder="请输入表达式"/>
          </a-form-model-item>
          <a-form-model-item label="描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'

import StandardTable from "@/components/table/StandardTable";
import {getValueTypeName} from '@/utils/value-type'

import {setDefaultValue} from '@/utils/json'

import {deleteFormula, formulaList, getFormula, saveFormula, updateFormula} from '@/services/formula'

export default {
  name: "Formula.vue",
  components: {StandardTable, PageLayout},
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
      loading: false,
      selectedRows: [],
      columns: [
        {
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '表达式配置',
          scopedSlots: {customRender: 'value'},
        },
        {
          title: '类型',
          dataIndex: 'valueType',
          scopedSlots: {customRender: 'valueType'},
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作', fixed: 'right',
          key: 'operation',
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
          name: null,
          dataId: this.dataId,
          dataType: this.dataType
        }
      },
      add: {
        visible: false,
        confirmLoading: false,
        form: {
          id: undefined,
          name: undefined,
          value: undefined,
          valueType: undefined,
          description: undefined,
          dataId: this.dataId,
          dataType: this.dataType
        },
        rules: {
          name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入名称"},
          value: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入表达式"},
          valueType: {min: 1, trigger: ['change', 'blur'], required: true, message: "请选择返回值类型"},
        }
      }
    }
  },
  created() {
    this.loadFormulaList();
  },
  methods: {
    handleAddOk() {
      this.add.confirmLoading = true;
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.add.form.id) {
            updateFormula(this.add.form).then(res => {
              if (res.data.data) {
                this.$message.success("修改成功！");
                this.add.visible = false;
                this.loadFormulaList();
              }
              this.add.confirmLoading = false
            });
          } else {
            saveFormula(this.add.form).then(res => {
              if (res.data.data) {
                this.$message.success("创建成功！");
                this.add.visible = false;
                this.loadFormulaList();
              }
              this.add.confirmLoading = false
            });
          }
        } else {
          this.add.confirmLoading = false;
          return false;
        }
      });
    },
    handleAddCancel() {
      this.$refs['addForm'].resetFields();
      this.add.visible = false
    },
    create() {
      this.add.visible = true;
      // 重置表单数据
      this.add.form = setDefaultValue(this.add.form);
      this.add.form.dataType = this.dataType;
      this.add.form.dataId = this.dataId;
    },
    getFormula(record) {
      getFormula({
        id: record.id
      }).then(res => {
        if (res.data.data) {
          this.add.form = res.data.data
          this.add.visible = true;
          this.add.form.dataType = this.dataType;
          this.add.form.dataId = this.dataId;
        }
      });
    },
    deleteById(record) {
      deleteFormula({
        id: record.id
      }).then(res => {
        if (res.data.data) {
          this.$message.success("删除成功！");
          this.loadFormulaList();
        }
      });
    },
    loadFormulaList() {
      this.loading = true;
      const _this = this;
      formulaList(this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows;
          _this.query.page = resp.data.page;
        } else {
          _this.dataSource = []
        }
        this.loading = false
      })
    },
    getValueTypeName(valueType) {
      return getValueTypeName(valueType)
    },
    submitSearch() {
      this.loadFormulaList()
    },
    resetForm() {
      this.query.query.name = ''
      this.loadFormulaList()
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
    },
  }
}
</script>

<style scoped>

</style>
