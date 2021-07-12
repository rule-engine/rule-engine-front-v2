<template>
  <div>
    <page-layout>
      <a-card title="规则预览发布" :bordered="false">
              <span slot="extra" style="margin-left: 16px;">
                1
              </span>

        11
      </a-card>
    </page-layout>

    <footer-tool-bar>
      <a-button type="primary" @click="previous()" :loading="footer.loading">上一步</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <a-button type="primary" @click="publish()" :loading="footer.loading">发布</a-button>
    </footer-tool-bar>

  </div>
</template>

<script>

import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";


export default {
  name: "Publish.vue",
  components: {PageLayout, FooterToolBar},
  data() {
    return {
      generalRule: {
        id: null,
        name: null,
        code: null,
        description: null,
        ruleId: null,
        conditionGroup: [],
        action: {
          value: undefined,
          valueName: null,
          valueType: 'NUMBER',
          type: null,
          loading: false,
          searchSelect: {
            data: [],
            value: undefined,
          }
        },
        defaultAction: {
          enableDefaultAction: 1,
          value: undefined,
          valueName: null,
          valueType: 'NUMBER',
          type: null,
          loading: false,
          searchSelect: {
            data: [],
            value: undefined,
          }
        },
      },
      footer: {
        loading: false,
      }
    }
  },
  mounted() {
    this.generalRule.id = this.$route.query.id;
    this.getRuleConfig();
  },
  methods: {
    getRuleConfig() {

    },
    previous() {
      this.$router.push({path: '/generalRuleConfig', query: {id: this.generalRule.id}})
    },
    publish() {

    }
  }
}
</script>

<style scoped>

</style>
