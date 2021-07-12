<template>
  <div>
    <page-layout>
      <a-card title="规则预览发布" :bordered="false">
        <span slot="extra" style="margin-left: 16px;">
              <a-popover trigger="click" arrow-point-at-center overlayClassName="runTest">

                            <a-card slot="content" title="模拟运行" style="width: 380px">
                              <a-icon slot="extra" type="right" @click="runTestMethod"
                                      v-if="!runTest.resultView"
                                      style="font-size: 16px;"></a-icon>
                              <a-icon slot="extra" type="arrow-left" @click="backToTest"
                                      v-if="runTest.resultView"
                                      style="font-size: 16px;"></a-icon>
                              <a-icon v-if="runTest.resultView" slot="extra" type="reload"
                                      @click="runTestMethod"
                                      style="font-size: 16px;margin-left: 10px;"/>

                              <a-empty v-if="request.param.length===0"/>


                              <a-form-model v-if="!runTest.run&&runTest.resultView">
                                  <a-form-model-item label="结果">
                                    <a-textarea v-model="runTest.value"/>
                                  </a-form-model-item>
                              </a-form-model>
                              <a-form-model v-else-if="!runTest.run&&!runTest.resultView">
                                  <a-form-model-item :label="param.name+'('+param.code+')'"
                                                     v-for="param in request.param" :key="param.code">
                                    <a-input-number v-if="param.valueType==='NUMBER'"
                                                    v-model="param.value" style="width: 100%"/>
                                      <a-select v-else-if="param.valueType==='BOOLEAN'"
                                                v-model="param.value" placeholder="请选择数据 ">
                                      <a-select-option value="true">true</a-select-option>
                                      <a-select-option value="false">false</a-select-option>
                                    </a-select>
                                    <a-textarea v-model="param.value"
                                                v-else-if="param.valueType==='COLLECTION'"/>
                                    <a-date-picker v-else-if="param.valueType==='DATE'" show-time
                                                   style="width: 100%"></a-date-picker>
                                    <a-input v-else v-model="param.value"></a-input>
                                  </a-form-model-item>
                              </a-form-model>

                              <div style="text-align: center" v-if="runTest.run">
                                 <a-progress type="circle" :percent="runTest.percent"
                                             :status="runTest.status"/>
                              </div>

                            </a-card>


                    <a-icon type="play-circle"
                            style="font-size: 18px;"></a-icon>
              </a-popover>
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

import {runTest, viewGeneralRule} from '@/services/generalRule'

export default {
  name: "Publish.vue",
  components: {PageLayout, FooterToolBar},
  data() {
    return {
      generalRule: {
        id: 226,
        name: null,
        code: 'ccc2222',
        description: null,
        workspaceCode: 'test',
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
      runTest: {
        run: false,
        percent: 0,
        status: 'normal',
        value: null,
        valueType: null,
        resultView: false,
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
    backToTest() {
      this.runTest.resultView = false;
    },
    runTestMethod() {
      this.runTest.status = 'normal'
      this.runTest.run = true;
      this.runTest.percent = 20;
      const params = {};
      this.request.param.forEach((e) => {
        params[e.code] = e.value === undefined ? '' : e.value;
      });
      let requestJson = {
        "id": this.generalRule.id,
        "status": 1,
        "code": this.generalRule.code,
        "workspaceCode": this.generalRule.workspaceCode,
        "param": params
      };
      this.runTest.percent = 40;
      runTest(requestJson).then(res => {
        console.log(res)
        if (res.data.data) {
          this.runTest.value = res.data.data.value + "";
          this.runTest.valueType = res.data.data.valueType;

          this.runTest.percent = 100;
          setTimeout(() => {
            this.runTest.run = false;
            this.runTest.percent = 0;
            this.runTest.resultView = true;
          }, 1000);
        } else {
          this.runTest.percent = 0;
          this.runTest.status = 'exception'
        }
      })
    },
    getRuleConfig() {
      viewGeneralRule({
        "id": this.generalRule.id,
        "status": 1
      }).then(res => {
        let da = res.data.data;
        this.generalRule = da;
        let param = {};
        if (da.parameters != null && da.parameters.length !== 0) {
          da.parameters.forEach((e) => {
            param[e.code] = '略';
          });
        }
        this.request.requestJson = JSON.stringify({
          "code": da.code,
          "workspaceCode": da.workspaceCode,
          "accessKeyId": '略',
          "accessKeySecret": '略',
          "param": param
        }, null, 6);
        this.request.param = da.parameters;
      })
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
