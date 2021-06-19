<template>
    <page-layout>
        <a-card :bordered="false" class="search-form">
            <a-form :form="form" layout="inline">
                <a-form-item label="用户名称">
                    <a-input/>
                </a-form-item>

                <a-form-item label="邮箱">
                    <a-input/>
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
                    style="clear: both"
                    :columns="columns"
                    :dataSource="dataSource"
                    :selectedRows.sync="selectedRows"
                    @clear="onClear"
                    @change="onChange"
                    @selectedRowChange="onSelectChange"
            >
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
            title: '头像',
            dataIndex: 'avatar', // ⚪小图
        },
        {
            title: '用户名称',
            width: '180px',
            dataIndex: 'username',
            // scopedSlots: { customRender: 'username' }
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: '180px',
            // needTotal: true,
            // customRender: (text) => text + ' 次'
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
                columns: columns,
                selectedRows: false,
                dataSource: [
                    {
                        id: '1',
                        username: 'admin',
                        avatar: '123',
                        email: 'admin@qq.com',
                        sex: '男',
                        createTime: '2020-15-21 20:20:1',
                    }
                ],
                form: this.$form.createForm(this)
            }
        }, methods: {
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

</style>