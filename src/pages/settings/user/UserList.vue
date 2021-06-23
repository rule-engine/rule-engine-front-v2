<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form ref="searchForm" :form="form" layout="inline">
        <a-form-item label="用户名称">
          <a-input v-model="query.query.username"/>
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input v-model="query.query.email"/>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="loadUserList()">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm()">
            重置
          </a-button>
        </a-form-item>
      </a-form>
      <a-divider dashed/>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">添加</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
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
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="user" slot-scope="{text, record}">
          <a-avatar size="small" icon="user" :src="record.avatar"/>
          {{ record.username }}
        </div>
        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="editMethod(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px" @click="deleteUser(record)">
            <a-icon type="delete"/>
            删除
          </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </a-card>

    <!--    添加用户弹窗-->
    <a-modal
        title="新增用户"
        :visible="showAddUserModel"
        :confirm-loading="confirmLoading"
        :width="700"
        @ok="handleSubmit('userAddForm')"
        @cancel="handleCancel('userAddForm')"
        okText="确认添加"
    >
      <div class="add">
        <a-form-model ref="userAddForm" :model="userAddForm" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="姓名" has-feedback prop="name">
            <a-input v-model="userAddForm.username" placeholder="请输入姓名">
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="密码" has-feedback prop="password">
            <a-input v-model="userAddForm.password" type="password" placeholder="请输入密码">
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="邮箱" has-feedback prop="email">
            <a-input v-model="userAddForm.email" type="email" placeholder="请输入邮箱">
              <a-icon slot="prefix" type="mail"></a-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="性别">
            <a-radio-group v-model="userAddForm.sex" placeholder="请选择性别">
              <a-radio value="男">
                男
              </a-radio>
              <a-radio value="女">
                女
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="手机号" has-feedback prop="phone">
            <a-input v-model="userAddForm.phone" placeholder="请输入手机号">
              <a-icon slot="prefix" type="phone"></a-icon>
            </a-input>
          </a-form-model-item>

        </a-form-model>
      </div>

    </a-modal>

    <a-modal
        title="编辑用户"
        :visible="edit.visible"
        :confirm-loading="edit.confirmLoading"
        :width="700"
        @ok="editHandleSubmit('editUser')"
        @cancel="editHandleCancel('editUser')"
        okText="保存"
    >
      <a-form-model ref="editUser" :rules="rules" :model="userEditForm" :label-col="{span: 4}"
                    :wrapper-col="{span: 14}">
        <a-form-model-item label="姓名" has-feedback prop="name">
          <a-input disabled="disabled" v-model="userEditForm.username" placeholder="请输入姓名">
            <a-icon slot="prefix" type="user"></a-icon>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" has-feedback prop="email">
          <a-input v-model="userEditForm.email" type="email" placeholder="请输入邮箱">
            <a-icon slot="prefix" type="mail"></a-icon>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="性别">
          <a-radio-group v-model="userEditForm.sex" placeholder="请选择性别">
            <a-radio value="男">
              男
            </a-radio>
            <a-radio value="女">
              女
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="手机号" has-feedback prop="phone">
          <a-input v-model="userEditForm.phone" placeholder="请输入手机号">
            <a-icon slot="prefix" type="phone"></a-icon>
          </a-input>
        </a-form-model-item>

      </a-form-model>

    </a-modal>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'

import {userList, addUser, deleteUser} from '@/services/user'

const columns = [
  {
    title: '编号',
    width: '120px',
    dataIndex: 'id'
  },
  {
    title: '用户',
    width: '180px',
    scopedSlots: {customRender: 'user'}
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '180px',
  },
  {
    title: '性别',
    width: '120px',
    dataIndex: 'sex',
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    width: '180px',
    scopedSlots: {customRender: 'action'}
  }
];

export default {
  name: "UserList",
  components: {PageLayout, StandardTable},
  data() {
    return {
      edit: {
        visible: false,
        confirmLoading: false,
      },
      userEditForm: {
        username: '',
        email: '',
        phone: '',
        sex: '男'
      },
      showAddUserModel: false,
      confirmLoading: false,
      columns: columns,
      selectedRows: [],
      dataSource: [],
      form: this.$form.createForm(this),
      userAddForm: {
        name: '',
        password: '',
        email: '',
        phone: '',
        sex: '男'
      },
      rules: {
        username: {min: 1, max: 16, trigger: ['change', 'blur'], required: true, message: "名字长度为1-16位",},
        email: {type: 'email', trigger: ['change', 'blur'], message: "请输入正确的邮箱", required: true},
        phone: {min: 6, trigger: ['change', 'blur'], required: false, message: "请输入正确的手机号"},
        password: {min: 3, trigger: ['change', 'blur'], required: true, message: "密码长度为3-16位"},
      },
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
          username: '',
          sex: '',
          email: ''
        }
      }
    }
  }
  ,
  created() {
    this.loadUserList()
  },
  methods: {
    handleSubmit(formName) {
      this.confirmLoading = true
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.userAddForm).then(res => {
            console.log(res)
            _this.$message.success("添加成功！")
            _this.confirmLoading = false
            _this.showAddUserModel = false
            _this.resetForm(formName)
          })
        } else {
          console.log('error submit!!');
          _this.confirmLoading = false
          return false;
        }
      });
    },
    editHandleSubmit(formName) {
      this.edit.confirmLoading = true
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {

          _this.edit.confirmLoading = false
        } else {
          console.log('error submit!!');
          _this.edit.confirmLoading = false
          return false;
        }
      });
    },
    loadUserList() {
      this.loading = true
      const _this = this;
      userList(this.query).then(res => {
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
    editMethod(record) {
      // 查询数据
      this.userEditForm.id = record.id;
      this.userEditForm.username = record.username;
      this.userEditForm.sex = record.sex;
      this.userEditForm.email = record.email;
      this.userEditForm.phone = record.phone;
      this.edit.visible = true;
    },
    deleteUser(record) {
      this.confirmLoading = true
      const _this = this;
      console.log("deleteUser", record);
      deleteUser({
        id: record.id,
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          _this.$message.success("删除成功！")
          _this.confirmLoading = false
          this.loadUserList();
        }
      })
    },
    resetForm() {
      this.query.query.username = this.query.query.email = ''
      this.loadUserList();
    },
    handleCancel(formName) {
      this.showAddUserModel = false
      this.$refs[formName].resetFields();
    },
    editHandleCancel(formName) {
      this.edit.visible = false
      this.$refs[formName].resetFields();
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    addNew() {
      this.showAddUserModel = true
    },
    handleMenuClick() {

    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(pagination) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      this.loadUserList();
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      //this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
  }
}
</script>

<style lang="less" scoped>
.search-form {
  margin-bottom: 24px;
}

</style>
