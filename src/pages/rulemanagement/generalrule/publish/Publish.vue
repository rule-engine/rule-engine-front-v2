<template>
  <div>
    <page-layout style="min-width: 600px">
      <a-card title="规则预览发布" :bordered="false">
        <span slot="extra" style="margin-left: 16px;">
              <a-popover trigger="click" arrow-point-at-center overlayClassName="runTest">
                            <a-card slot="content" title="请求参数" style="width: 380px">
                              <a-icon slot="extra" type="copy"
                                      style="font-size: 16px;"></a-icon>

                              1
                            </a-card>
                    <a-icon type="copy"
                            style="font-size: 18px;"></a-icon>
              </a-popover>
        </span>

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

                              <a-empty v-if="!runTest.run&&!runTest.resultView&&request.param.length===0"/>


                              <a-form-model v-else-if="!runTest.run&&runTest.resultView">
                                  <a-form-model-item label="结果">
                                    <a-textarea v-model="runTest.value"/>
                                  </a-form-model-item>
                              </a-form-model>
                              <a-form-model v-else-if="!runTest.run&&!runTest.resultView">
                                  <a-form-model-item :label="param.name+'('+param.code+')'"
                                                     style="margin-bottom: 8px;"
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
                                                   v-model="param.value"
                                                   @change="(date,dateString)=>(datePickerChange(param,date,dateString))"
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

        <a-timeline>
          <a-timeline-item v-for="(cg,cgi) in generalRule.conditionGroup" :key="cg.id">
            <span style="color: #606266;font-size: 14px;" v-if="0===cgi">如果</span>
            <span style="color: #606266;font-size: 14px;" v-else>或者</span>
            <div v-for="(cgc) in cg.conditionGroupCondition" style="margin-left: 20px;" :key="cgc.id">
              <a-alert style="background-color: #f4f4f5;border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px"
                       class="conditionItem">
                <p slot="description" style="margin-bottom: 0;">
                  <a-tag color="blue" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                    （{{ cgc.condition.name }}）
                  </a-tag>
                  <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                    {{ getConditionNamePrefix(cgc.condition.config.leftValue.type) }}
                  </a-tag>
                  {{ getViewValue(cgc.condition.config.leftValue) }}
                  &nbsp;
                  <a-tag color="orange" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                    {{ cgc.condition.config.symbol }}
                  </a-tag>
                  <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                    {{ getConditionNamePrefix(cgc.condition.config.rightValue.type) }}
                  </a-tag>
                  {{ getViewValue(cgc.condition.config.rightValue) }}
                </p>
              </a-alert>
            </div>
          </a-timeline-item>
        </a-timeline>

        <span style="color: #606266;font-size: 14px;">返回</span>
        <div style="margin-left: 20px;margin-top: 3px;">
          <a-alert :closable="false" type="success" style="border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px">
            <p slot="description" style="margin-bottom: 0;">
              {{ getActionView(generalRule.action) }}
            </p>
          </a-alert>
        </div>
        <span v-if="generalRule.conditionGroup.length!==0">
                    <span style="color: #606266;font-size: 14px;">否则返回</span>
                    <br>
                    <div style="margin-left: 20px;margin-top: 3px;">
                      <a-alert :closable="false" type="warning"
                               style="border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px">
                        <p slot="description" style="margin-bottom: 0;">
                        {{ getDefaultActionView(generalRule.defaultAction) }}
                        </p>
                      </a-alert>
                    </div>
       </span>

      </a-card>
    </page-layout>

    <footer-tool-bar>
      <a-button type="primary" @click="previous()" :loading="footer.loading">进入编辑</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <a-button type="primary" @click="publish()" :loading="footer.loading">发布</a-button>
    </footer-tool-bar>

  </div>
</template>

<script>

import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";

import {runTest, viewGeneralRule} from '@/services/generalRule'
import moment from "moment";

export default {
  name: "Publish.vue",
  components: {PageLayout, FooterToolBar},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
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
    this.generalRule.id = this.id
    this.getRuleConfig();
  },
  methods: {
    datePickerChange(v, date, dateString) {
      console.log(dateString)
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    getActionView(action) {
      if (action.variableValue != null) {
        return action.variableValue;
      }
      if (action.valueName === '') {
        return '空';
      }
      return action.valueName;
    },
    getDefaultActionView(defaultAction) {
      if (defaultAction.enableDefaultAction === 0) {
        return this.getActionView(defaultAction);
      } else {
        return 'null';
      }
    },
    getConditionNamePrefix(type) {
      if (type === 0) {
        return "参数";
      }
      if (type === 1) {
        return "变量";
      }
      if (type === 2) {
        return "固定值";
      }
    },
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
      this.$emit("choicePage", {pageIndex: 2, id: this.generalRule.id})
    },
    publish() {

    },
    getViewValue(v) {
      // 如果是固定值
      if (v.type === 2) {
        return v.value;
      }
      // 如果是固定值变量的 变量值
      if (v.variableValue !== null) {
        return v.variableValue;
      }
      if (v.valueName !== null) {
        return v.valueName;
      }
      return v.value;
    },
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
