<template>
  <div>
    <page-layout>
      <a-card title="规则预览发布" :bordered="false">
        <a-card title="规则配置" :bordered="false">
        <span slot="extra" style="margin-left: 16px;">
              <a-popover trigger="click" arrow-point-at-center overlayClassName="runTest">

                            <a-card slot="content" title="模拟运行1" style="width: 380px">
                                              <a-icon slot="extra" type="right"
                                                      style="font-size: 18px;"></a-icon>
                              <a-icon slot="extra" type="reload" style="font-size: 18px;margin-left: 10px;"/>

                                                  <a-empty v-if="request.param.length===0"/>
<a-form-model>
    <a-form-model-item :label="param.name+'('+param.code+')'" v-for="param in request.param" :key="param.code">
      <a-input/>
    </a-form-model-item>
</a-form-model>
                            </a-card>


                    <a-icon type="play-circle"
                            style="font-size: 18px;"></a-icon>
              </a-popover>
        </span>

          11
        </a-card>
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
      },
      request: {
        url: "http://ruleserver.cn/ruleEngine/generalRule/execute",
        requestJson: null,
        param: [{
          name: "年龄",
          value: null,
          code: "age",
          valueType: 'STRING',
        }],
      },
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

<style lang="less">
.runTest {
  .ant-popover-inner-content {
    padding: 0 0;
  }
}

</style>
