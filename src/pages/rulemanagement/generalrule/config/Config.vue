<template>
  <div>
    <page-layout>
      <a-card title="规则配置" :bordered="false">
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


    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>

    <a-drawer
        placement="left"
        :closable="false"
        :visible="drawer.visible"
        @close="onClose"
    >

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="参数">
          我是参数列表
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

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar},
  data() {
    return {
      footer: {
        loading: false,
      },
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
  }
}
</script>

<style scoped>

</style>
