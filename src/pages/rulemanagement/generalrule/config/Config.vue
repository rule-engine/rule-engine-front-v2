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

                <a-card title="条件组1" :bordered="false">
                    1
                    <!--          <a-alert message="条件1" type="info" closable-->
                    <!--                   @close="onClose"/>-->
                    <!--          <br>-->
                    <!--          <a-alert message="条件2" type="info" closable-->
                    <!--                   @close="onClose"/>-->
                    <!--          <br>-->
                    <!--          <a-alert message="条件3" type="info" closable-->
                    <!--                   @close="onClose"/>-->
                    <!--          <br>-->
                </a-card>

                <a-card title="条件组2" :bordered="false">
                    1
                </a-card>

                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
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
                }
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

            }
        }
    }
</script>

<style lang="less" scoped>
    .openLeft {
        width: 30px;
        height: 80px;
        position: fixed;
        margin-left: -20px;
        z-index: 19;
    }
</style>
