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
      rules: {}
    }
  },
  methods: {
    previous() {
      this.$router.push('/generalRuleDefinition')
    },
    nextStep() {
      //this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
