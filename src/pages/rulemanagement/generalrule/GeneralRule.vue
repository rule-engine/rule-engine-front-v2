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
                        <a-select-option>全部</a-select-option>
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
                    rowKey="id"
                    style="clear: both"
                    :columns="columns"
                    :dataSource="dataSource"
                    :selectedRows.sync="selectedRows"
                    @clear="onClear"
                    @change="onChange"
                    @selectedRowChange="onSelectChange"
            >
                <div slot="user" slot-scope="{text, record}">
                    <a-avatar size="small" icon="user" :src="record.userAvatar"/>
                    {{ record.createUserName }}
                </div>

                <div slot="versionStatus" slot-scope="{record}">
                    <a-tag v-if="record.publishVersion!==null" style="cursor: pointer;padding: 0 6px" color="blue">
                        线上({{record.publishVersion}})
                    </a-tag>
                    <a-tag v-if="record.status===0" color="pink"
                           style="cursor: pointer;padding: 0 6px">
                        开发<!--开发中没有版本-->
                    </a-tag>
                    <a-tag v-else-if="record.status===1" color="cyan"
                           style="cursor: pointer;padding: 0 6px">
                        测试({{record.currentVersion}})
                    </a-tag>
                </div>

                <div slot="action" slot-scope="{ record}">
                    <a style="margin-right: 8px">
                        <a-icon type="eye"/>
                        查看
                    </a>
                    <a style="margin-right: 8px">
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
                    <a style="margin-right: 8px">
                        <a-icon type="redo"/>
                        回退
                    </a>
                    <a style="margin-right: 8px">
                        <a-icon type="delete"/>
                        删除
                    </a>
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

            <a-form :form="form" layout="inline">
                <a-form-item label="用户名称/编码">
                    <a-input/>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="queryMember()">
                        搜索
                    </a-button>
                </a-form-item>
            </a-form>
            <br>

            <standard-table
                    rowKey="id"
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
                <div slot="edit">
                    <a-switch default-checked/>
                </div>
                <div slot="publish">
                    <a-switch/>
                </div>
            </standard-table>
        </a-modal>

    </page-layout>
</template>

<script>
    import PageLayout from '@/layouts/PageLayout'
    import StandardTable from '@/components/table/StandardTable'
    import {list} from '@/services/generalRule'


    const columns = [
        {
            title: '编号',
            width: '100px',
            dataIndex: 'id'
        },
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
            title: '规则版本状态',
            width: '280px',
            scopedSlots: {customRender: 'versionStatus'}
        },
        {
            title: '创建人',
            width: '140px',
            scopedSlots: {customRender: 'user'}
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '180px',
            sorter: true
        },
        {
            title: '操作',
            width: '180px',
            scopedSlots: {customRender: 'action'}
        }
    ];

    export default {
        name: 'GeneralRule',
        components: {PageLayout, StandardTable},
        i18n: require('./i18n'),
        data() {
            return {
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
                        status: null,
                    }
                },
                columns: columns,
                selectedRows: [],
                authority: {
                    visible: false,
                    confirmLoading: false,
                    loading: false,
                    selectedRows: [],
                    dataSource: [
                        {
                            id: 1,
                            username: "admin",
                            email: "123123@qq.com",
                            avatar: "",
                            createTime: "2020-02-23 9:09:0",
                        }
                    ],
                    columns: [
                        {
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
                            dataIndex: 'email',
                            width: '180px',
                        },
                        {
                            title: '编辑权限',
                            width: '180px',
                            scopedSlots: {customRender: 'edit'}
                        },
                        {
                            title: '发布权限',
                            width: '180px',
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
                            width: '180px',
                            dataIndex: 'name'
                        },
                        {
                            title: '编码',
                            dataIndex: 'code',
                            width: '180px',
                        },
                        {
                            title: '规则版本',
                            width: '180px',
                            dataIndex: 'version',
                            sorter: true
                        },
                        // {
                        //   title: '创建人',
                        //   width: '140px',
                        //   scopedSlots: {customRender: 'user'}
                        // },
                        {
                            title: '创建时间',
                            dataIndex: 'createTime',
                            width: '180px',
                            sorter: true
                        },
                        {
                            title: '操作',
                            width: '220px',
                            scopedSlots: {customRender: 'action'}
                        }
                    ]
                },
                dataSource: [],
            }
        },
        created() {
            this.loadDataList();
        },
        methods: {
            loadDataList() {
                this.loading = true;
                const _this = this;
                list(this.query).then(res => {
                    console.log(res);
                    const resp = res.data;
                    if (resp.data) {
                        _this.dataSource = resp.data.rows;
                        _this.query.page = resp.data.page
                    } else {
                        _this.dataSource = []
                    }
                    this.loading = false
                });
            },
            submitForm() {
                this.loadDataList();
            },
            resetForm() {

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
            showHistoryVersion(record) {
                this.historyVersion.visible = true
                console.log(record)
            },
            historyVersionHandleOk() {
                this.historyVersion.visible = false
                this.historyVersion.confirmLoading = false
            },
            historyVersionHandleCancel() {
                this.historyVersion.visible = false
            },
            showAuthority(record) {
                this.authority.visible = true
                console.log(record)
            },
            authorityVersionHandleOk() {
                this.authority.visible = false
                this.authority.confirmLoading = false
            },
            authorityVersionHandleCancel() {
                this.authority.visible = false
            },
            queryMember() {

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
