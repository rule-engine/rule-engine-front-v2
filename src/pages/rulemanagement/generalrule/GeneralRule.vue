<template>
    <page-layout>
        <search-form/>
        <a-list
                :grid="{gutter: 16, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}"
                style="margin: 0 -8px"
        >
            <a-list-item :key="n" v-for="n in 12" style="padding: 0 8px">
                <a-card>
                    <a-card-meta title="Angular">
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
                    <a-tooltip class="tool" title="分享" slot="actions">
                        <a-icon type="share-alt"/>
                    </a-tooltip>
                    <a-dropdown class="tool" slot="actions">
                        <a-icon type="ellipsis"/>
                        <a-menu slot="overlay">
                            <a-menu-item style="font-size: 12px">规则信息</a-menu-item>
                            <a-menu-item style="font-size: 12px">删除</a-menu-item>
                        </a-menu>
                    </a-dropdown>
                    <div class="content">
                        <div>
                            <p>活跃用户</p>
                            <p>18万</p>
                        </div>
                        <div>
                            <p>新增用户</p>
                            <p>1,338</p>
                        </div>
                    </div>
                </a-card>
            </a-list-item>
        </a-list>
    </page-layout>
</template>

<script>
    import PageLayout from '@/layouts/PageLayout'
    import SearchForm from './SearchForm'

    export default {
        name: 'GeneralRule',
        components: {SearchForm, PageLayout},
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
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
