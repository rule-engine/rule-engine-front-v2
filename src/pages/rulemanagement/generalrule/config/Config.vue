<template>
    <div>
        <page-layout>
            <a-card title="规则配置" :bordered="false">
                <div class="openLeft">
                    <a-icon type="appstore" style="font-size: 20px" @click="showDrawer"/>
                    <br>
                    <br>
                    <a-icon type="setting" style="font-size: 20px"/>
                </div>

                <a-card title="条件集" class="condition_set">
                    <a-card title="条件组1" :bordered="false">
                        <a-alert closable style="background-color: #f4f4f5;border:none;padding: 6px 30px 6px 6px;"
                                 class="conditionItem">
                            <p slot="description" style="margin-bottom: 0;">
                                <a-tag color="blue" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    （条件一）
                                </a-tag>
                                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    元素
                                </a-tag>
                                sasdfasdf
                                &nbsp;
                                <a-tag color="orange" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    大于等于
                                </a-tag>
                                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    元素
                                </a-tag>
                                asdf
                            </p>
                        </a-alert>
                        <br>
                        <a-alert closable style="background-color: #f4f4f5;border:none;padding: 6px 30px 6px 6px"
                                 class="conditionItem">
                            <p slot="description" style="margin-bottom: 0;">
                                <a-tag color="blue" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    （条件二）
                                </a-tag>
                                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    元素
                                </a-tag>
                                asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf
                                &nbsp;
                                <a-tag color="orange" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    等于
                                </a-tag>
                                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                    元素
                                </a-tag>
                                asdf
                            </p>
                        </a-alert>

                        <!--123123123-->
                        <br>
                        <a-form-model
                                ref="dynamicValidateForm"
                                :model="dynamicValidateForm"
                                v-bind="formItemLayoutWithOutLabel"
                        >
                            <a-form-model-item
                                    v-for="(domain, index) in dynamicValidateForm.domains"
                                    :key="domain.key"
                                    v-bind="index === 0 ? formItemLayout : {}"
                                    label="搜索条件"
                            >
                                <!--laceholder="请根据条件名称搜索"-->
                                <a-input
                                        v-model="domain.value"
                                        style="width: 60%; margin-right: 8px"
                                />
                                <a-icon
                                        v-if="dynamicValidateForm.domains.length === 1"
                                        class="dynamic-delete-button"
                                        type="minus-circle-o"
                                        @click="removeDomain(domain)"
                                />
                            </a-form-model-item>
                            <a-form-model-item v-bind="formItemLayoutWithOutLabel" v-if="this.dynamicValidateForm.domains.length===0">
                                <a-button type="dashed" style="width: 60%" @click="addDomain">
                                    <a-icon type="plus"/>
                                    添加条件
                                </a-button>
                            </a-form-model-item>
                        </a-form-model>
                        <!--asdfasdfased-->
                    </a-card>

                    <a-card title="条件组2" :bordered="false">
                        <a-skeleton/>
                    </a-card>
                </a-card>
                <br>
                <a-card title="结果">
                    1
                </a-card>
                <br>
                <a-card title="默认结果">
                    1
                </a-card>
                <!--        <a-collapse v-model="activeKey"  expand-icon-position="left">-->
                <!--          <a-collapse-panel key="1" header="规则1">-->
                <!--            <p>规则1的配置信息</p>-->
                <!--            <a-icon slot="extra" type="setting" @click="handleClick"/>-->
                <!--          </a-collapse-panel>-->
                <!--          <a-collapse-panel key="2" header="规则2">-->
                <!--            <p>规则2</p>-->
                <!--            <a-icon slot="extra" type="setting" @click="handleClick"/>-->
                <!--          </a-collapse-panel>-->
                <!--          <a-collapse-panel key="3" header="规则3">-->
                <!--            <p>规则3</p>-->
                <!--            <a-icon slot="extra" type="setting" @click="handleClick"/>-->
                <!--          </a-collapse-panel>-->
                <!--        </a-collapse>-->
            </a-card>
        </page-layout>

        <footer-tool-bar>
            <a-button type="primary" @click="previous()" :loading="footer.loading">上一步</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <a-button type="primary" @click="nextStep()" :loading="footer.loading">下一步</a-button>
        </footer-tool-bar>

        <a-drawer
                placement="left"
                :closable="false"
                width="460px"
                :visible="drawer.visible"
                @close="onClose"
        >

            <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="参数">
                    <input-parameter/>
                </a-tab-pane>
                <a-tab-pane key="2" tab="变量">
                    我是变量列表
                </a-tab-pane>
                <a-tab-pane key="3" tab="表达式">
                    我是表达式列表
                </a-tab-pane>
            </a-tabs>
        </a-drawer>
    </div>
</template>

<script>
    import FooterToolBar from '@/components/tool/FooterToolBar'
    import PageLayout from "@/layouts/PageLayout";
    import InputParameter from "./InputParameter";

    export default {
        name: "Config",
        components: {PageLayout, FooterToolBar, InputParameter},
        data() {
            return {
                footer: {
                    loading: false,
                },
                activeKey: ['1'],
                generalRule: {
                    id: null,
                    name: null,
                    code: null,
                    description: null,
                },
                rules: {},
                drawer: {
                    visible: false
                },
                formItemLayout: {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 4 },
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 20 },
                    },
                },
                formItemLayoutWithOutLabel: {
                    wrapperCol: {
                        xs: { span: 24, offset: 0 },
                        sm: { span: 20, offset: 4 },
                    },
                },
                dynamicValidateForm: {
                    domains: [],
                },
            }
        },
        methods: {
            previous() {
                this.$router.push('/generalRuleDefinition')
            },
            nextStep() {
                //this.$router.push('/')
            },
            showDrawer() {
                this.drawer.visible = true;
            },
            onClose() {
                this.drawer.visible = false;
            },
            handleClick() {

            },
            addDomain() {
                this.dynamicValidateForm.domains.push({
                    value: '',
                    key: Date.now(),
                });
            },
            removeDomain(item) {
                let index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                    this.dynamicValidateForm.domains.splice(index, 1);
                }
            },
        }
    }
</script>

<style lang="less">
    .condition_set {
        .ant-alert-close-icon {
            margin-top: -5px;
        }
    }
</style>

<style lang="less" scoped>
    .openLeft {
        width: 30px;
        height: 80px;
        position: fixed;
        margin-left: -20px;
        z-index: 19;
    }

    .conditionItem {

    }

    .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
    }
    .dynamic-delete-button:hover {
        color: #777;
    }
    .dynamic-delete-button[disabled] {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>
