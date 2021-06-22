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
      >
        <div slot="userList" slot-scope="{text, record}">
          <div class="admin-avatar" :style="'margin-left:'+((index*20+10)-20)+'px;z-index:'+index" :key="user.id"
               v-for="(user,index) in record.userList">
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
        <div slot="action">
          <a style="margin-right: 8px" @click="showEdit">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px" @click="showModal">
            <a-icon type="edit"/>
            成员
          </a>
          <a style="margin-right: 8px">
            <a-icon type="edit"/>
            密钥
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

    <a-modal
            title="新建工作空间"
            :visible="add.visible"
            :confirm-loading="add.confirmLoading"
            :width="700"
            @ok="addHandleOk"
            @cancel="addHandleCancel">
      <template>
        <a-form-model :model="add.form" :label-col="add.labelCol" :wrapper-col="add.wrapperCol">
          <a-form-model-item label="空间名称">
            <a-input v-model="add.form.name" />
          </a-form-model-item>
          <a-form-model-item label="空间编码">
            <a-input v-model="add.form.code"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述">
            <a-input v-model="add.form.description" type="textarea" />
          </a-form-model-item>
          <!--          @click="onSubmit"-->
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
            title="编辑工作空间"
            :visible="edit.visible"
            :confirm-loading="edit.confirmLoading"
            :width="700"
            @ok="editHandleOk"
            @cancel="editHandleCancel">
      <template>
        <a-form-model :model="edit.form" :label-col="edit.labelCol" :wrapper-col="edit.wrapperCol">
          <a-form-model-item label="空间名称">
            <a-input v-model="edit.form.name" />
          </a-form-model-item>
          <a-form-model-item label="空间编码">
            <a-input readonly="readonly" v-model="edit.form.code"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述">
            <a-input v-model="edit.form.description" type="textarea" />
          </a-form-model-item>
<!--          @click="onSubmit"-->
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
        title="工作空间成员"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :width="700"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <a-form :form="form" layout="inline">
        <a-form-item label="用户名称/编码">
          <a-input
              v-decorator="['nameCode', {rules: [{  whitespace: true}]}]"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submitForm('ruleForm')">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
      <!--      <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">-->
      <!--        <a-form-item label="名称">-->
      <!--          <a-input-->
      <!--                  v-decorator="['name', {rules: [{  whitespace: true}]}]"/>-->
      <!--        </a-form-item>-->
      <!--        <a-form-item label="编码">-->
      <!--          <a-input/>-->
      <!--        </a-form-item>-->
      <!--        <a-form-item label="说明">-->
      <!--          <a-textarea  :rows="4" />-->
      <!--        </a-form-item>-->
      <!--      </a-form>-->
      <br>
      <a-space class="operator">
        <a-button @click="showModal1" type="primary">新增成员</a-button>
      </a-space>
      <br> <br>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="管理员">

          <standard-table
              rowKey="id"
              style="clear: both"
              :columns="member.columns"
              :dataSource="member.dataSource"
              :selectedRows.sync="member.selectedRows"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action">
              <a style="margin-right: 8px">
                <a-icon type="edit"/>
                解除管理
              </a>
              <a style="margin-right: 8px">
                <a-icon type="delete"/>
                删除
              </a>
            </div>
          </standard-table>

        </a-tab-pane>
        <a-tab-pane key="2" tab="用户" force-render>
          <standard-table
              rowKey="id"
              style="clear: both"
              :columns="member.columns"
              :dataSource="member.dataSource"
              :selectedRows.sync="member.selectedRows"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action">
              <a style="margin-right: 8px">
                <a-icon type="edit"/>
                设为管理
              </a>
              <a style="margin-right: 8px">
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
        :visible="visible1"
        :confirm-loading="confirmLoading1"
        :width="700"
        @ok="handleOk1"
        @cancel="handleCancel1">
      <a-transfer
          :data-source="mockData"
          :titles="['当前已选中', '可选']"
          :target-keys="targetKeys"
          :disabled="disabled"
          :show-search="true"
          :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          :show-select-all="false"
          @change="onChange1">
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
              :columns="direction === 'left' ? leftColumns : rightColumns"
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
          "
          >
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
    width: '220px',
    scopedSlots: {customRender: 'action'}
  }
];

const mockData = [];
for (let i = 0; i < 7; i++) {
  mockData.push({
    key: i.toString(),
    user: `admin${i + 1}`,
    email: `admin${i + 1}`,
    avatar: '123123',
    disabled: false,
  });
}

const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
  {
    // dataIndex: 'user',
    title: '用户',
    scopedSlots: {customRender: 'user'}
  },
  {
    dataIndex: 'email',
    title: '邮箱',
  },
];
const rightTableColumns = [
  {
    //dataIndex: 'user',
    title: '用户',
    scopedSlots: {customRender: 'user'}
  },
  {
    dataIndex: 'email',
    title: '邮箱',
  },
];
export default {
  name: "Workspace",
  components: {PageLayout, StandardTable},


  data() {
    return {
      edit:{
        visible:false,
        confirmLoading:false,
        //表单数据
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          name:"默认空间名称",
          code:"default",
          description:"这玩意是描述"
        },
      },
      add:{
        visible:false,
        confirmLoading:false,
        //表单数据
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          name:"",
          code:"",
          description:""
        },
      },
      member: {
        columns: [{
          title: '编号',
          width: '100px',
          dataIndex: 'id'
        },
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
        dataSource: [
          {
            id: '1',
            username: 'admin',
            avatar: 'http://oss-boot-test.oss-cn-beijing.aliyuncs.com/ruleengine/26.jpg?Expires=33153093613&OSSAccessKeyId=LTAIyEa5SulNXbQa&Signature=Ot%2BLvt7eKKy5jUN4ufZfEmLtrqM%3D',
            email: 'admin@qq.com',
          },
          {
            id: '2',
            username: 'asdf',
            avatar: 'sadf',
            email: 'asdf@qq.com',
          }
        ]
      },
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
          }, {
            id: 6,
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
      loading: true,
      ModalText: 'Content of the modal',
      visible: false,
      visible1: false,
      confirmLoading: false,
      confirmLoading1: false,
      mockData,
      targetKeys: originTargetKeys,
      disabled: false,
      showSearch: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
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
    showAdd() {
      this.add.visible = true;
    },
    addHandleCancel(/*e*/) {
      console.log('Clicked cancel button');
      this.add.visible = false;
    },
    addHandleOk(){
      this.ModalText = 'The modal will be closed after two seconds';
      this.add.confirmLoading = true;
      setTimeout(() => {
        this.add.visible = false;
        this.add.confirmLoading = false;
        //  表单提交
        // console.log('addSubmit!', this.add.form);
      }, 2000);
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
    showEdit() {
      this.edit.visible = true;
    },
    showModal() {
      this.visible = true;
    },
    showModal1() {
      this.visible1 = true;
    },
    handleOk(/*e*/) {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleOk1(/*e*/) {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading1 = true;
      setTimeout(() => {
        this.visible1 = false;
        this.confirmLoading1 = false;
      }, 2000);
    },
    editHandleOk(){
      this.ModalText = 'The modal will be closed after two seconds';
      this.edit.confirmLoading = true;
      setTimeout(() => {
        this.edit.visible = false;
        this.edit.confirmLoading = false;
      //  表单提交
        console.log('submit!', this.edit.form);
      }, 2000);
    },
    editHandleCancel(/*e*/) {
      console.log('Clicked cancel button');
      this.edit.visible = false;
    },
    handleCancel(/*e*/) {
      console.log('Clicked cancel button');
      this.visible = false;
    },
    handleCancel1(/*e*/) {
      console.log('Clicked cancel button');
      this.visible1 = false;
    },
    callback(key) {
      console.log(key);
    },
    onChange1(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
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
