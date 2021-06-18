<template>
    <a-card :bordered="false" class="search-form">
        <a-form :form="form" layout="inline">
            <a-form-item label="规则名称">
                <a-input/>
            </a-form-item>

            <a-form-item label="规则编码">
                <a-input/>
            </a-form-item>

            <a-form-item label="规则状态">
                <a-select default-value="0" placeholder="不限" style="width: 174px">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">草稿</a-select-option>
                    <a-select-option value="2">编辑中</a-select-option>
                    <a-select-option value="3">待发布</a-select-option>
                    <a-select-option value="4">已发布</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-model-item>
                <a-button type="primary" @click="submitForm('ruleForm')">
                    搜索
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
                    重置
                </a-button>
            </a-form-model-item>
        </a-form>
        <a-divider dashed />
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
</template>

<script>


    export default {
        name: 'SearchForm',
        components: {},
        data() {
            return {
                form: this.$form.createForm(this)
            }
        },
        methods: {
            lookMyself() {
                this.form.setFieldsValue({
                    owner: '3'
                })
            },
            addNew() {

            },
            handleMenuClick() {

            }
        }
    }
</script>

<style lang="less" scoped>
    .search-form {
        margin-bottom: 24px;
    }
</style>
