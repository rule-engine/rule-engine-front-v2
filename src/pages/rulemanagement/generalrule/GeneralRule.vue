<template>
    <page-layout>
        <a-card :bordered="false" class="search-form">
            <a-form :form="form" layout="inline">
                <a-form-item :label="$t('ruleName')">
                    <a-input/>
                </a-form-item>

                <a-form-item label="规则编码">
                    <a-input/>
                </a-form-item>

                <a-form-item label="规则状态">
                    <a-select  placeholder="全部" style="width: 120px">
                        <a-select-option value="0">全部</a-select-option>
                        <a-select-option value="1">编辑中</a-select-option>
                        <a-select-option value="2">待发布</a-select-option>
                        <a-select-option value="3">已发布</a-select-option>
                    </a-select>
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


        <a-list
                :grid="{gutter: 16, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}"
                style="margin: 0 -8px"
        >
            <a-list-item :key="n" v-for="n in 12" style="padding: 0 8px">

                <a-card>
                    <a-card-meta title="规则名称（规则Code）">
                        <!--规则创建人头像，鼠标悬浮，弹出用户信息-->
                        <a-avatar slot="avatar"
                                  src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"
                                  size="small"/>
                    </a-card-meta>
                    <!--下载可执行json数据 草稿状态不支持下载-->
                    <a-tooltip class="tool" title="下载" slot="actions">
                        <a-icon type="download"/>
                    </a-tooltip>
                    <a-tooltip class="tool" title="编辑" slot="actions">
                        <a-icon type="edit"/>
                    </a-tooltip>
                    <!--分享可分享别的工作空间人员，并分配权限-->
                    <a-tooltip class="tool" title="权限" slot="actions">
                        <a-icon type="team" />
                    </a-tooltip>
                    <a-dropdown class="tool" slot="actions">
                        <a-icon type="ellipsis"/>
                        <a-menu slot="overlay">
                            <a-menu-item style="font-size: 12px">规则信息</a-menu-item>
                            <a-menu-item style="font-size: 12px">历史版本</a-menu-item>
                            <a-menu-item style="font-size: 12px">删除</a-menu-item>
                        </a-menu>
                    </a-dropdown>

                    <div class="content">
<!--                        <div>-->
<!--                            <p>活跃用户</p>-->
<!--                            <p>18万</p>-->
<!--                        </div>-->
<!--                        <div>-->
<!--                            <p>新增用户</p>-->
<!--                            <p>1,338</p>-->
<!--                        </div>-->
                    </div>
<!--                  <br>-->
<!--                  <div>-->
<!--                    <a-tag color="blue">-->
<!--                      线上(1.0)-->
<!--                    </a-tag>-->
<!--                    <a-tag color="orange">-->
<!--                      待发布(2.0)-->
<!--                    </a-tag>-->
<!--                  </div>-->
                </a-card>

            </a-list-item>
        </a-list>

        <a-card style="clear: both" :bordered="false">
            <a-pagination
                    show-size-changer
                    :default-current="3"
                    :total="500"
                    @showSizeChange="onShowSizeChange"
            />
        </a-card>
    </page-layout>
</template>

<script>
    import PageLayout from '@/layouts/PageLayout'

    export default {
        name: 'GeneralRule',
        components: {PageLayout},
        i18n: require('./i18n'),
        data() {
            return {
                form: this.$form.createForm(this)
            }
        }, methods: {
            onShowSizeChange(current, pageSize) {
                console.log(current, pageSize);
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
<!--<style lang="less">-->
<!--.ant-card-body{-->
<!--  padding-bottom: 10px;-->
<!--}-->
<!--</style>-->
