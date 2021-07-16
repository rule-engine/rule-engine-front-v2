<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form layout="inline">
        <a-form-item :label="$t('ruleName')">
          <a-input v-model="query.query.name"/>
        </a-form-item>

        <a-form-item label="规则编码">
          <a-input v-model="query.query.code"/>
        </a-form-item>

        <a-form-item label="规则状态">
          <a-select placeholder="全部" style="width: 120px" v-model="query.query.status">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">开发</a-select-option>
            <a-select-option value="1">测试</a-select-option>
            <a-select-option value="2">线上</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="submitForm()">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm()">
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
          :scroll="{ x: 1200 }"
          rowKey="id"
          style="clear: both"
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          :loading="loading"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
                      pageSize: this.query.page.pageSize,
                      total: this.query.page.total}"
      >
        <div slot="user" slot-scope="{text, record}">
          <a-avatar size="small" icon="user" :src="record.createUserAvatar"/>
          {{ record.createUserName }}
        </div>

        <div slot="versionStatus" class="data-status" slot-scope="{record}">
          <a-tag v-if="record.publishVersion!==null" style="cursor: pointer;padding: 0 6px" color="blue">
            线上({{ record.publishVersion }})
          </a-tag>
          <a-tag v-if="record.status===0" color="pink"
                 style="cursor: pointer;padding: 0 6px">
            开发<!--开发中没有版本-->
          </a-tag>
          <a-tag v-else-if="record.status===1" color="orange"
                 style="cursor: pointer;padding: 0 6px">
            测试({{ record.currentVersion }})
          </a-tag>
        </div>

        <div slot="action" slot-scope="{ record}">
          <!--          <a style="margin-right: 8px" @click="view(record)">-->
          <!--            <a-icon type="eye"/>-->
          <!--            查看-->
          <!--          </a>-->
          <a style="margin-right: 8px" @click="edit(record)">
            <a-icon type="edit"/>
            编辑
          </a>

          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-icon type="info"/>
                基本信息
              </a-menu-item>
              <a-menu-item @click="downloadGeneralRule(record)">
                <a-icon type="download"/>
                下载
              </a-menu-item>
              <a-menu-item @click="showHistoryVersion(record)">
                <a-icon type="history"/>
                历史版本
              </a-menu-item>
              <a-menu-item @click="showAuthority(record)">
                <a-icon type="team"/>
                权限
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                    title="你确定要删除这个普通规则吗"
                    ok-text="是"
                    cancel-text="不了"
                    @confirm="deleteRow(record)"
                >
                  <a>
                    <a-icon type="delete"/>
                    删除
                  </a>
                </a-popconfirm>
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
        title="历史版本"
        :visible="historyVersion.visible"
        :confirm-loading="historyVersion.confirmLoading"
        :width="700"
        @ok="historyVersionHandleOk"
        @cancel="historyVersionHandleCancel"
    >

      <standard-table
          rowKey="id"
          style="clear: both"
          :columns="historyVersion.columns"
          :loading="historyVersion.loading"
          :dataSource="historyVersion.dataSource"
          :selectedRows.sync="historyVersion.selectedRows"
      >
        <div slot="user" slot-scope="{text, record}">
          <a-avatar size="small" icon="user" :src="record.avatar"/>
          {{ record.username }}
        </div>
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
                <a-icon type="redo"/>
                回退
              </a-menu-item>
              <a-menu-item @click="showHistoryVersion(record)">
                <a-icon type="delete"/>
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </standard-table>
    </a-modal>

    <a-modal
        title="权限设置"
        :visible="authority.visible"
        :confirm-loading="authority.confirmLoading"
        :width="700"
        @ok="authorityVersionHandleOk"
        @cancel="authorityVersionHandleCancel"
    >

      <a-form layout="inline">
        <a-form-item label="用户名称/编码">
          <a-input v-model="authority.query.query.username"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="queryMember()">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
      <br>

      <standard-table
          rowKey="userId"
          style="clear: both"
          :columns="authority.columns"
          :loading="authority.loading"
          :dataSource="authority.dataSource"
          :selectedRows.sync="authority.selectedRows"
      >
        <div slot="user" slot-scope="{text, record}">
          <a-avatar size="small" icon="user" :src="record.avatar"/>
          {{ record.username }}
        </div>
        <div slot="edit" slot-scope="{record}">
          <a-switch :checked="record.writeAuthority===0" @change="onChangeAuthority(record,1)"/>
        </div>
        <div slot="publish" slot-scope="{record}">
          <a-switch :checked="record.publishAuthority===0" @change="onChangeAuthority(record,2)"/>
        </div>
      </standard-table>
    </a-modal>


    <a-modal
        title="新建规则"
        :visible="newGeneralRule.visible"
        :confirm-loading="newGeneralRule.confirmLoading"
        :width="700"
        ok-text="下一步"
        @ok="newGeneralRuleHandleOk('generalRule')"
        @cancel="newGeneralRuleHandleCancel('generalRule')"
    >
      <a-form-model ref="generalRule" :rules="newGeneralRule.rules" :model="newGeneralRule.form" :label-col="{span: 4}"
                    :wrapper-col="{span: 14}">
        <a-form-model-item label="名称" has-feedback prop="name">
          <a-input v-model="newGeneralRule.form.name" placeholder="请输入规则名称">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="编码" has-feedback prop="code">
          <a-input v-model="newGeneralRule.form.code" type="code"
                   placeholder="请输入规则编码">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="说明" has-feedback prop="description">
          <a-input v-model="newGeneralRule.form.description" type="textarea" placeholder="请输入规则说明"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'

import {list, deleteGeneralRule, verifyRuleCode, addGeneralRule} from '@/services/generalRule'
import {dataPermissionList, update} from '@/services/dataPermission'
import {exportData} from '@/services/importExport'

//import uuidv1 from 'uuid/v1'


export default {
  name: 'GeneralRule',
  components: {PageLayout, StandardTable},
  i18n: require('./i18n'),
  data() {
    return {
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
          name: null,
          code: null,
          status: '',
        }
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code',
        },
        {
          title: '规则版本状态',
          scopedSlots: {customRender: 'versionStatus'}
        },
        {
          title: '创建人',
          scopedSlots: {customRender: 'user'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '操作', fixed: 'right',
          scopedSlots: {customRender: 'action'}
        }
      ],
      selectedRows: [],
      authority: {
        visible: false,
        confirmLoading: false,
        loading: false,
        selectedRows: [],
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
            username: null,
            dataType: 0, // 0为普通规则
            dataId: null,
          }
        },
        dataSource: [],
        columns: [
          {
            title: '用户',
            scopedSlots: {customRender: 'user'}
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '编辑权限',
            scopedSlots: {customRender: 'edit'}
          },
          {
            title: '发布权限',
            scopedSlots: {customRender: 'publish'}
          },
        ]
      },
      historyVersion: {
        visible: false,
        confirmLoading: false,
        selectedRows: [],
        loading: false,
        dataSource: [
          {
            id: 1,
            name: "1",
            code: "1",
            version: "v1.0",
            username: "admin",
            avatar: "",
            createTime: "2020-02-23 9:09:0",
          }
        ],
        columns: [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '编码',
            dataIndex: 'code',
          },
          {
            title: '规则版本',
            dataIndex: 'version',
            sorter: true
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true
          },
          {
            title: '操作', fixed: 'right',
            scopedSlots: {customRender: 'action'}
          }
        ]
      },
      dataSource: [],
      newGeneralRule: {
        form: {
          id: null,
          name: null,
          code: null,
          description: null,
        },
        visible: false,
        confirmLoading: false,
        rules: {
          name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入规则名称",},
          code: {trigger: ['blur'], asyncValidator: this.ruleCodeValidator, required: true},
        }
      }
    }
  },
  created() {
    this.loadDataList();
  },
  methods: {
    ruleCodeValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入规则编码'));
      } else {
        verifyRuleCode({param: value}).then(resp => {
          if (resp.data.code === 200) {
            if (!resp.data.data) {
              callback()
            } else {
              callback(new Error('该规则编码已经存在！'));
            }
          } else {
            callback(new Error(resp.data.message));
          }
        })
      }

    },
    deleteRow(record) {
      this.loading = true;
      deleteGeneralRule({id: record.id}).then(res => {
        if (res.data.data) {
          this.$message.success("删除成功！");
          // 重新加载列表
          this.loadDataList();
        }
        this.loading = false;
      })
    },
    loadDataList() {
      this.loading = true;
      const _this = this;
      list(this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows;
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
      }).finally(() => this.loading = false);
    },
    submitForm() {
      this.loadDataList();
    },
    resetForm() {
      this.query.query = {
        name: null,
        code: null,
        status: null,
      };
      this.loadDataList();
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    addNew() {
      this.newGeneralRule.visible = true;
      this.newGeneralRule.form = {
        id: null,
        name: null,
        code: null,
        description: null,
      }
    },
    newGeneralRuleHandleOk(formName) {
      this.newGeneralRule.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addGeneralRule(this.newGeneralRule.form).then(res => {
            if (res.data.code === 200) {
              this.$openPage({
                path: '/generalRuleRouter/' + res.data.data,
                query: {pageIndex: 2}
              }, `规则(${this.newGeneralRule.form.name})`);
              this.newGeneralRule.visible = false;
            }
          }).finally(() => this.newGeneralRule.confirmLoading = false)
        } else {
          this.newGeneralRule.confirmLoading = false;
        }
      })
    },
    newGeneralRuleHandleCancel(formName) {
      this.newGeneralRule.visible = false;
      this.$refs[formName].resetFields();
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
        this.query.page.pageIndex = pagination.current;
        this.query.page.pageSize = pagination.pageSize
      }
      console.log(pagination, filters, sorter, currentDataSource);
      this.loadDataList();
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      //this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    edit(record) {
      this.$openPage({
        path: '/generalRuleRouter/' + record.id,
        query: {pageIndex: 2}
      }, `规则(${record.name})`);
    },
    downloadGeneralRule(record) {
      console.log(record)
      exportData({
        dataType: 0,
        dataId: record.id,
        // 默认有最新版本下载最新的，否则下载已发布的
        version: (record.currentVersion != null ? record.currentVersion : record.publishVersion)
      });
    },
    showHistoryVersion(record) {
      this.historyVersion.visible = true;
      console.log(record)
    },
    historyVersionHandleOk() {
      this.historyVersion.visible = false;
      this.historyVersion.confirmLoading = false
    },
    historyVersionHandleCancel() {
      this.historyVersion.visible = false
    },
    showAuthority(record) {
      this.authority.visible = true;
      this.authority.loading = true;
      this.authority.query.query.dataId = record.id;
      this.queryMember();
    },
    authorityVersionHandleOk() {
      this.authority.visible = false
      this.authority.confirmLoading = false
    },
    authorityVersionHandleCancel() {
      this.authority.visible = false
    },
    queryMember() {
      dataPermissionList(this.authority.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          this.authority.dataSource = resp.data.rows;
          this.authority.query.page = resp.data.page
        } else {
          this.authority.dataSource = []
        }
        this.authority.loading = false;
      })
    },
    onChangeAuthority(record, type) {
      let wa = record.writeAuthority;
      let pa = record.publishAuthority;
      if (type === 1) {
        wa = record.writeAuthority === 1 ? 0 : 1;
      } else if (type === 2) {
        pa = record.publishAuthority === 1 ? 0 : 1;
      }
      var _this = this;
      this.authority.loading = true;
      update({
        userId: record.userId,
        publishAuthority: pa,
        writeAuthority: wa,
        dataId: _this.authority.query.query.dataId,
        dataType: _this.authority.query.query.dataType,
      }).then(resp => {
        if (resp.data.data) {
          record.writeAuthority = wa;
          record.publishAuthority = pa;
          this.$message.success('操作成功')
        }
      }).finally(() => {
        this.authority.loading = false;
      })

    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  margin-bottom: 24px;
}

.clearfix() {
  zoom: 1;
  &:before,
  &:after {
    content: ' ';
    display: table;
  }
  &:after {
    clear: both;
    visibility: hidden;
    font-size: 0;
    height: 0;
  }
}

.content {
  .clearfix();
  margin-top: 16px;
  margin-left: 40px;

  & > div {
    position: relative;
    text-align: left;
    float: left;
    width: 50%;

    p {
      line-height: 32px;
      font-size: 24px;
      margin: 0;
    }

    p:first-child {
      color: @text-color-second;
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 4px;
    }
  }
}

</style>
<style lang="less">
.data-status {
  .ant-tag-pink {
    background: white;
  }

  .ant-tag-blue {
    background: white;
  }

  .ant-tag-orange {
    background: white;
  }
}
</style>
