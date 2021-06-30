<template>
    <page-layout>
        <a-card :bordered="false" class="search-form" label-width="40px">
            <a-form ref="searchForm" layout="inline">
                <a-form-item label="名称">
                    <a-input v-model="query.query.name"/>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="loadFunctionList()">
                        搜索
                    </a-button>
                    <a-button style="margin-left: 10px" type="reset" @click="reset()">
                        重置
                    </a-button>
                </a-form-item>
            </a-form>
            <a-button style="margin-top: 10px" type="primary" @click="addFunctionForm">新建函数</a-button>
        </a-card>

        <a-card>
            <standard-table
                    rowKey="id"
                    style="clear: both"
                    :columns="tableData"
                    :dataSource="dataSource"
                    @change="onChange"
                    :selectedRows.sync="selectedRows"
                    :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
            >
                <div slot="action" slot-scope="{record}">
                    <a style="margin-right: 8px" @click="view(record)">
                        <a-icon type="edit"/>
                        查看
                    </a>
                    <a style="margin-right: 8px" @click="test(record)">
                        <a-icon type="delete"/>
                        测试
                    </a>
                </div>
            </standard-table>
        </a-card>
        <!--      查看-->
        <a-modal
                title="函数详情"
                :visible="form.dialogFormVisible"
                :confirm-loading="form.confirmLoading"
                :width="700"
                @cancel="selectFunctionCancel()"
        >
            <a-form-model ref="selectFunction" :model="form" :label-col="{span: 4}" :wrapper-col="{span: 14}">
                <a-form-model-item label="名称" has-feedback prop="name">
                    <!--                    <input type="textbox" value="Some value" readonly="readonly"/>-->
                    <a-input disabled="disabled" v-model="form.data.name"/>
                </a-form-model-item>
                <a-form-model-item label="执行器" has-feedback prop="executor">
                    <a-input disabled="disabled" v-model="form.data.executor"/>
                </a-form-model-item>
                <a-form-model-item label="参数" has-feedback prop="paramsJson">
                    <a-input type="textarea" disabled="disabled" v-model="form.data.paramsJson" autosize/>
                </a-form-model-item>
                <a-form-model-item label="返回类型" has-feedback prop="returnValueType">
                    <a-select disabled="disabled" v-model="form.data.returnValueType" placeholder="返回类型">
                        <a-select-option value="BOOLEAN">布尔</a-select-option>
                        <a-select-option value="COLLECTION">集合</a-select-option>
                        <a-select-option value="STRING">字符串</a-select-option>
                        <a-select-option value="NUMBER">数值</a-select-option>
                        <a-select-option value="DATE">日期</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="说明" has-feedback prop="description">
                    <a-input type="textarea" disabled="disabled" v-model="form.data.description"/>
                </a-form-model-item>
            </a-form-model>


            <div slot="footer" class="dialog-footer">
                <a-button @click="form.dialogFormVisible = false">关 闭</a-button>
            </div>
        </a-modal>

    </page-layout>
</template>


<script>
    import PageLayout from '@/layouts/PageLayout'
    import StandardTable from '@/components/table/StandardTable'

    import {functionList, selectFunctionById} from '@/services/function'

    const columns = [
        {
            title: '编号',
            width: '120px',
            dataIndex: 'id'
        },
        {
            title: '名称',
            width: '200px',
            dataIndex: 'name'
        },
        {
            title: '执行器',
            dataIndex: 'executor',
            width: '240px',
        },
        {
            title: '返回值类型',
            width: '200px',
            dataIndex: 'returnValueType',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '180px',
            sorter: true
        },
        {
            title: '操作',
            width: '140px',
            scopedSlots: {customRender: 'action'}
        }
    ];

    export default {
        name: "Function",
        components: {PageLayout, StandardTable},

        data() {
            return {
                form: {
                    dialogFormVisible: false,
                    confirmLoading: false,
                    data: {
                        name: '',
                        returnValueType: '',
                        description: '',
                        executor: '',
                        paramsJson: ''
                    }
                },
                tableData: columns,
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
                        name: ''
                    }
                },
            }
        },
        methods: {
            //  列表
            loadFunctionList() {
                this.loading = true;
                const _this = this;
                functionList(this.query).then(res => {
                    console.log(res.data)
                    const resp = res.data;
                    if (resp.code === 200) {
                        _this.dataSource = resp.data.rows
                        _this.query.page = resp.data.page
                    } else {
                        _this.dataSource = []
                    }
                })
            },
            //  翻页
            onChange(pagination) {
                if (pagination) {
                    this.query.page.pageIndex = pagination.current
                    this.query.page.pageSize = pagination.pageSize
                }
                this.loadFunctionList();
            },
            //  查看
            view(row) {
                this.form.confirmLoading = true
                if (row.id != null) {
                    selectFunctionById(row).then(res => {
                        const resp = res.data;
                        if (resp.code === 200) {
                            this.form.data = resp.data;
                            this.form.data.paramsJson = JSON.stringify(resp.data.params, null, 4);
                            this.form.dialogFormVisible = true
                        }
                    })
                }
            },
            selectFunctionCancel() {
                this.form.dialogFormVisible = false
                this.form.confirmLoading = false
            },
            addFunctionForm() {
                alert("尽情期待");
            },
            reset() {
                this.query.query.name = ''
                this.loadFunctionList();
            },
        },
        mounted() {
            this.loadFunctionList();
        }
    }
</script>

<style scoped>


</style>
