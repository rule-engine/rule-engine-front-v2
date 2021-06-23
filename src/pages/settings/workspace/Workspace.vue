<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form-model layout="inline">
        <a-form-model-item label="名称">
          <a-input
              v-model="query.query.name"/>
        </a-form-model-item>
        <a-form-model-item label="编码">
          <a-input
              v-model="query.query.code"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="submitForm('ruleForm')">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <a-divider dashed/>
      <a-space class="operator">
        <a-button @click="showAdd" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="audit">发布</a-menu-item>
            <a-menu-item key="notInService">暂停使用</a-menu-item>
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
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          // current: 2,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="workspaceAdminList" slot-scope="{text, record}">
          <div class="admin-avatar" :style="'margin-left:'+((index*20+10)-20)+'px;z-index:'+index" :key="user.id"
               v-for="(user,index) in record.workspaceAdminList">
            <a-avatar v-if="index<4" size="small" icon="user" :src="user.avatar"/>
            <a-avatar size="small" :src="user.avatar" style="margin-left:-2px;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        -webkit-filter: blur(2px);
                        -moz-filter: blur(3px);
                        -o-filter: blur(3px);
                        -ms-filter: blur(2px);
                        filter: blur(2px);" v-else-if="index===4"/>
          </div>
        </div>
        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="showEdit">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px" @click="showMember(record)">
            <a-icon type="team"/>
            成员
          </a>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-icon type="edit"/>
                密钥
              </a-menu-item>
              <a-menu-item>
                <a-icon type="delete"/>
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </a-card>

    <a-modal
        title="新建工作空间"
        :visible="add.visible"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="addHandleOk('addWorkspace')"
        @cancel="addHandleCancel('addWorkspace')">
      <template>
        <a-form-model ref="addWorkspace" :model="add.form" :rules="rules" :label-col="add.labelCol"
                      :wrapper-col="add.wrapperCol">
          <a-form-model-item label="空间名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入空间名称"/>
          </a-form-model-item>
          <a-form-model-item label="空间编码" has-feedback prop="code">
            <a-input v-model="add.form.code" placeholder="请输入空间编码"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
        title="编辑工作空间"
        :visible="edit.visible"
        :confirm-loading="edit.confirmLoading"
        :width="700"
        @ok="editHandleOk('editWorkspace')"
        @cancel="editHandleCancel('editWorkspace')">
      <template>
        <a-form-model ref="editWorkspace" :model="edit.form" :rules="rules" :label-col="edit.labelCol"
                      :wrapper-col="edit.wrapperCol">
          <a-form-model-item label="空间名称" has-feedback prop="name">
            <a-input v-model="edit.form.name"/>
          </a-form-model-item>
          <a-form-model-item label="空间编码">
            <a-input disabled="disabled" v-model="edit.form.code"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述">
            <a-input v-model="edit.form.description" type="textarea"/>
          </a-form-model-item>
          <!--          @click="onSubmit"-->
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
        title="工作空间成员"
        :visible="member.visible"
        :confirm-loading="member.confirmLoading"
        :width="700"
        @ok="memberHandleOk"
        @cancel="memberHandleCancel"
    >
      <a-form :form="form" layout="inline">
        <a-form-item label="用户名称/编码">
          <a-input v-model="member.query.query.userName"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="queryMember()">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
      <br>
      <a-space class="operator">
        <a-button @click="showAddMember" type="primary">新增成员</a-button>
      </a-space>
      <br> <br>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="管理员">

          <standard-table
              rowKey="userId"
              style="clear: both"
              :columns="member.columns"
              :loading="member.loading"
              :dataSource="member.dataSource"
              :selectedRows.sync="member.selectedRows"
              :pagination="{showSizeChanger: true, showQuickJumper: true,
              pageSize: this.member.query.page.pageSize,
              total: this.member.query.page.total}"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action" slot-scope="{ record}">
              <a style="margin-right: 8px">
                <a-icon type="edit"/>
                解除管理
              </a>
              <a style="margin-right: 8px" @click="deleteMember(record)">
                <a-icon type="delete"/>
                删除
              </a>
            </div>
          </standard-table>

        </a-tab-pane>
        <a-tab-pane key="2" tab="用户" force-render>
          <standard-table
              rowKey="userId"
              style="clear: both"
              :loading="member.loading"
              :columns="member.columns"
              :dataSource="member.dataSource"
              :selectedRows.sync="member.selectedRows"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action" slot-scope="{ record}">
              <a style="margin-right: 8px">
                <a-icon type="edit"/>
                设为管理
              </a>
              <a style="margin-right: 8px" @click="deleteMember(record)">
                <a-icon type="delete"/>
                删除
              </a>
            </div>
          </standard-table>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <a-modal
        title="新增成员"
        :visible="addMember.visible"
        :confirm-loading="addMember.confirmLoading"
        :width="700"
        @ok="addMemberHandleOk"
        @cancel="addMemberHandleCancel">
      <a-transfer
          :data-source="addMember.dataSource"
          :titles="['可选', '当前已选中']"
          :target-keys="addMember.targetKeys"
          :disabled="addMember.disabled"
          :show-search="true"
          @search="handleSearch"
          :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          :show-select-all="false"
          @change="addMemberOnChange">
        <template
            slot="children"
            slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <a-table
              :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          "
              :columns="direction === 'left' ? addMember.leftColumns : addMember.rightColumns"
              :data-source="filteredItems"
              size="small"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })
          ">
            <div slot="user" slot-scope="{user,avatar}">
              <a-avatar size="small" icon="user" :src="avatar"/>
              {{ user }}
            </div>
          </a-table>
        </template>
      </a-transfer>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import difference from 'lodash/difference';

//api
import {list} from '@/services/workspace'
import {memberList, bindMember, optionalPersonnel, deleteMember} from '@/services/workspaceMember'
//import {userList} from '@/services/user'


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
  },
  {
    title: '编码',
    width: '120px',
    dataIndex: 'code',
  },
  {
    title: '管理员',
    width: '180px',
    scopedSlots: {customRender: 'workspaceAdminList'}
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    width: '220px',
    scopedSlots: {customRender: 'action'}
  }
];


export default {
  name: "Workspace",
  components: {PageLayout, StandardTable},


  data() {
    return {
      edit: {
        visible: false,
        confirmLoading: false,
        //表单数据
        labelCol: {span: 4},
        wrapperCol: {span: 14},
        form: {
          name: "默认空间名称",
          code: "default",
          description: "这玩意是描述"
        },
      },
      add: {
        visible: false,
        confirmLoading: false,
        //表单数据
        labelCol: {span: 4},
        wrapperCol: {span: 14},
        form: {
          name: "",
          code: "",
          description: ""
        },
      },
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入空间名称",},
        code: {min: 1, trigger: ['change', 'blur'], message: "请输入空间编码", required: true},
        description: {trigger: ['change', 'blur'], required: false, message: ""},
      },
      member: {
        loading: true,
        visible: false,
        confirmLoading: false,
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
            workspaceId: '',
            userName: '',
            type: 1 //默认查询管理tob
          }
        },
        columns: [
          {
            title: '用户',
            width: '180px',
            scopedSlots: {customRender: 'user'}
          },
          {
            title: '邮箱',
            width: '180px',
            dataIndex: 'email',
          },
          {
            title: '操作',
            width: '180px',
            scopedSlots: {customRender: 'action'}
          }],
        selectedRows: [],
        dataSource: []
      },
      columns: columns,
      selectedRows: [],
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
          code: '',
          name: ''
        }
      },
      form: this.$form.createForm(this),
      loading: true,
      ModalText: 'Content of the modal',
      visible: false,
      addMember: {
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
            workspaceId: null,
          }
        },
        loading: true,
        visible: false,
        confirmLoading: false,
        dataSource: [],
        targetKeys: [],
        disabled: false,
        showSearch: false,
        leftColumns: [{
          title: '用户',
          scopedSlots: {customRender: 'user'}
        },
          {
            dataIndex: 'email',
            title: '邮箱',
          },],
        rightColumns: [{
          title: '用户',
          scopedSlots: {customRender: 'user'}
        },
          {
            dataIndex: 'email',
            title: '邮箱',
          },],
      },
      confirmLoading: false,
    }

  }, watch: {
    query: {
      handler: function () {
        // console.log(val)
        // this.loadWorkspaceList()
      },
      deep: true
    },
  }
  , created() {
    this.loadWorkspaceList()
  }, methods: {
    resetForm() {
      this.query.query.name = this.query.query.code = ''
      this.loadWorkspaceList()
    }, loadWorkspaceList() {
      this.loading = true
      const _this = this;
      list(this.query).then(res => {
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
    handleSearch(dir, value) {
      console.log('search:', dir, value);
      if (dir === 'left') {
        this.addMember.query.query.username = value;
        this.addMemberLoadUserList();
      }
    }
    , submitForm() {
      this.loadWorkspaceList()
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    showAdd() {
      this.add.visible = true;
    },
    addHandleCancel(formName) {
      this.$refs[formName].resetFields();
      this.add.visible = false;
    },
    addHandleOk(formName) {
      var _this = this
      this.add.visible = true;
      this.add.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          setTimeout(() => {
            _this.$message.success("添加成功！")
            _this.add.visible = false;
            _this.$refs[formName].resetFields();
          }, 1500)
        }
        _this.add.confirmLoading = false;
      })
    },
    editHandleOk(formName) {
      this.edit.visible = true;
      this.edit.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          setTimeout(() => {
            this.$message.success("修改成功！");
            this.edit.visible = false;
            this.edit.confirmLoading = false;
            this.$refs[formName].resetFields();
          }, 1500)
        }
      })
    },
    deleteMember(record) {
      deleteMember({
        userId: record.userId,
        workspaceId: this.member.query.query.workspaceId
      }).then(res => {
        console.log(res)
        // 重新加载列表
        this.queryMember();
      })
    },
    editHandleCancel(formName) {
      this.$refs[formName].resetFields();
      this.edit.visible = false;
    },
    handleMenuClick() {

    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(pagination, filters, sorter, {currentDataSource}) {
      if (pagination) {

        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      if (sorter) {
        this.query.orders[0].desc = (!sorter.order || sorter.order === 'ascend')
      }

      console.log(pagination, filters, sorter, currentDataSource)
      this.loadWorkspaceList()
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      //this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    showEdit() {
      this.edit.visible = true;
    },
    showMember(record) {
      this.member.visible = true;
      // this.addMember.query.query.workspaceId 筛选查询用户列表需要
      this.addMember.query.query.workspaceId = this.member.query.query.workspaceId = record.id;
      this.queryMember();
    },
    queryMember() {
      // 查询后端数据
      this.member.loading = true
      const _this = this.member;
      memberList(this.member.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.member.loading = false
      })
    },
    showAddMember() {
      // 查询用户列表
      this.addMemberLoadUserList();
      this.addMember.visible = true;
    },
    addMemberLoadUserList() {
      this.addMember.loading = true
      const _this = this.addMember;
      optionalPersonnel(_this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = Array.from(resp.data.rows).map(m => (
              {
                key: m.userId,
                title: m.username, // 搜索用
                user: m.username,
                email: m.email,
                avatar: m.avatar,
                disabled: false,
              }
          ));
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.addMember.loading = false
      })
    },
    memberHandleOk(/*e*/) {
      this.member.confirmLoading = true;
      this.loadWorkspaceList();
    },
    addMemberHandleOk(/*e*/) {
      this.addMember.confirmLoading = true;
      // 调用接口
      // this.addMember.targetKeys; 为已选择的用户id
      bindMember({
        workspaceId: this.member.query.query.workspaceId,
        userList: this.addMember.targetKeys
      }).then(res => {
        console.log(res)
        this.addMember.visible = false;
        this.addMember.confirmLoading = false;
        // 添加成员后，重新加载 后期优化
        this.queryMember();
      })
    },
    memberHandleCancel(/*e*/) {
      this.member.visible = false;
      this.loadWorkspaceList();
    },
    addMemberHandleCancel(/*e*/) {
      console.log('Clicked cancel button');
      this.addMember.visible = false;
    },
    callback(key) {
      this.member.query.query.type = key;
      // 切换tob
      this.queryMember();
    },
    addMemberOnChange(nextTargetKeys) {
      this.addMember.targetKeys = nextTargetKeys;
    },

    triggerDisable(disabled) {
      this.disabled = disabled;
    },

    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
    },
    getRowSelection({disabled, selectedKeys, itemSelectAll, itemSelect}) {
      return {
        getCheckboxProps: item => ({props: {disabled: disabled || item.disabled}}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
              .filter(item => !item.disabled)
              .map(({key}) => key);
          const diffKeys = selected
              ? difference(treeSelectedKeys, selectedKeys)
              : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({key}, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    }
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
  margin-top: -10px;
}

</style>
