<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form :form="form" layout="inline">
        <a-form-item label="工作空间/编码">
          <a-input
              v-decorator="['nameCode', {rules: [{  whitespace: true}]}]"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitForm('ruleForm')">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
            重置
          </a-button>
        </a-form-item>
      </a-form>
      <a-divider dashed/>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="audit">发布</a-menu-item>
            <a-menu-item key="audit">暂停使用</a-menu-item>
            <a-menu-item key="delete">删除</a-menu-item>
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
          :loading="loading"
          @selectedRowChange="onSelectChange"
      >
        <div slot="userList" slot-scope="{text, record}">
          <div style="position:relative">
            <div class="admin-avatar" :style="'padding-left:'+((index+1)*24-5)+'px;z-index:'+index" :key="user.id"
                 v-for="(user,index) in record.userList">
              <a-avatar v-if="index<4" size="small" icon="user" :src="user.avatar"/>
            </div>
          </div>
          <div style="float: right" v-if="record.userList.length>4">...</div>

        </div>
        <div slot="action">
          <a style="margin-right: 8px">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px">
            <a-icon type="delete"/>
            删除
          </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'


const columns = [
  {
    title: '编号',
    width: '120px',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: '180px',
    // needTotal: true,
    // customRender: (text) => text + ' 次'
  },
  {
    title: '编码',
    width: '120px',
    dataIndex: 'code',
  },
  {
    title: '管理员',
    width: '180px',
    // dataIndex: 'user',avatar
    scopedSlots: {customRender: 'userList'}
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
      columns: columns,
      selectedRows: [],
      dataSource: [
        {
          id: '1',
          avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D',
          name: '默认工作空间',
          code: 'default',
          createTime: '2020-15-21 20:20:1',
          userList: [{
            id: 1,
            name: 'user1',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 2,
            name: 'user2',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 3,
            name: 'user3',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 4,
            name: 'user4',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 5,
            name: 'user5',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }]
        },
        {
          id: '2',
          avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D',
          name: '工作空间一',
          code: 'workspace1',
          createTime: '2020-15-21 20:20:1',
          userList: [{
            id: 1,
            name: 'user1',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 2,
            name: 'user2',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }, {
            id: 3,
            name: 'user3',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D'
          }]
        }

      ],
      form: this.$form.createForm(this),
      loading: true
    }

  }, created() {
    this.loadWorkspaceList()
  }, methods: {
    resetForm() {
      this.form.setFieldsValue({nameCode: ''});
      this.loadWorkspaceList()

    }, loadWorkspaceList() {
      this.loading = true
      const nameCode = this.form.getFieldValue('nameCode')
      var query = {
        nameCode: nameCode ? nameCode : ''
      }
      console.log(query)
      this.loading = false
    }
    , submitForm() {
      this.loadWorkspaceList()
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    addNew() {

    },
    handleMenuClick() {

    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      this.$message.info('表格状态改变了')
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

.admin-avatar {
  position: absolute;
  float: left;
}

</style>
