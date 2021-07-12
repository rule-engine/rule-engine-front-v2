<template>
  <div>
    <page-layout>
      <a-card title="规则配置" :bordered="false">
        <div class="openLeft">
          <a-icon type="appstore" style="font-size: 18px;color: #777;" @click="showDrawer"/>
          <br>
          <br>
          <a-icon type="setting" style="font-size: 18px;color: #777;"/>
        </div>

        <a-card title="条件集" class="condition_set">

          <a-skeleton v-if="generalRule.conditionGroup.length===0" :paragraph="{ rows: 3 }"/>

          <a-card :title="cg.name" :bordered="false" v-for="cg in generalRule.conditionGroup" :key="cg.id">

            <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px" slot="extra"
                    @click="deleteConditionGroup(cg)"></a-icon>

            <a-skeleton v-if="cg.conditionGroupCondition.length===0" :paragraph="{ rows: 2 }"/>

            <a-alert closable style="background-color: #f4f4f5;border:none;padding: 6px 30px 6px 6px;"
                     v-for="cgc in cg.conditionGroupCondition"
                     :key="cgc.id"
                     class="conditionItem">
              <p slot="description" style="margin-bottom: 0;">
                <a-tag color="blue" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                  （{{ cgc.condition.name }}）
                </a-tag>
                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                  {{ getConditionNamePrefix(cgc.condition.config.leftValue.type) }}
                </a-tag>
                {{ cgc.condition.config.leftValue.valueName }}
                &nbsp;
                <a-tag color="orange" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                  {{ getSymbolExplanation(cgc.condition.config.symbol) }}
                </a-tag>
                <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                  {{ getConditionNamePrefix(cgc.condition.config.rightValue.type) }}
                </a-tag>
                {{ cgc.condition.config.rightValue.valueName }}
              </p>
            </a-alert>
            <br>
            <a-button type="dashed" style="width: 50%;display:block;margin:0 auto" @click="addDomain">
              <a-icon type="plus" style="color: #777;"/>
              添加条件
            </a-button>

          </a-card>
          <a-button type="dashed" style="width: 100%" @click="addConditionGroup()">
            <a-icon type="plus" style="color: #777;"/>
            添加条件组
          </a-button>
        </a-card>
        <br>
        <br>
        <a-card title="结果">

                    <span slot="extra">
                        <a-popover title="温馨提示">
                            <template slot="content">
                                <p>普通规则结果类型确认后，及规则发布后，则不支持修改！</p>
                                <p>（具体原因可参考链接：T320523）</p>
                            </template>
                            <a-icon type="info-circle" class="dynamic-delete-button" style="font-size: 18px"></a-icon>
                        </a-popover>
                    </span>
          <span slot="extra" style="margin-left: 16px;">
                        <a-popover title="默认结果" trigger="click" arrow-point-at-center>
                            <template slot="content">
                                <div style="width: 400px;">
                                                 <a-switch v-model="generalRule.defaultAction.enableDefaultAction"/>
                                    <br> <br>
                                    <a-row>
                                        <a-col :span="5">
                                            <a-select style="width:100%"
                                                      v-model="generalRule.defaultAction.valueType">
                                                <a-select-option value="PARAMETER">参数</a-select-option>
                                                <a-select-option value="VARIABLE">变量</a-select-option>
                                                <a-select-option value="BOOLEAN">布尔</a-select-option>
                                                <a-select-option value="COLLECTION">集合</a-select-option>
                                                <a-select-option value="STRING">字符串</a-select-option>
                                                <a-select-option value="NUMBER">数值</a-select-option>
                                                <a-select-option value="DATE">日期</a-select-option>
                                            </a-select>
                                        </a-col>
                                        <a-col :span="1"></a-col>
                                        <a-col :span="18">
                                            <a-input
                                                v-model="generalRule.defaultAction.value"></a-input>
                                        </a-col>
                                    </a-row>
                                </div>
                            </template>

                              <a-icon type="pull-request" class="dynamic-delete-button"
                                      style="font-size: 18px"></a-icon>
                        </a-popover>
                    </span>

          <a-row>
            <a-col :span="5">
              <a-select style="width:100%" v-model="generalRule.action.valueType">
                <a-select-option value="PARAMETER">参数</a-select-option>
                <a-select-option value="VARIABLE">变量</a-select-option>
                <a-select-option value="BOOLEAN">布尔</a-select-option>
                <a-select-option value="COLLECTION">集合</a-select-option>
                <a-select-option value="STRING">字符串</a-select-option>
                <a-select-option value="NUMBER">数值</a-select-option>
                <a-select-option value="DATE">日期</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="18">
              <a-input v-model="generalRule.action.value"></a-input>
            </a-col>
          </a-row>
        </a-card>
        <br>
        <br>
        <br>
      </a-card>
    </page-layout>


    <a-modal
        title="创建条件"
        :visible="selectCondition.open"
        :confirm-loading="selectCondition.confirmLoading"
        :width="700"
        @ok="addConditionOk()"
        @cancel="addConditionHandleCancel()"
        okText="确认添加"
    >
      <a-form-model ref="addConditionForm" :model="selectCondition.from" :rules="rules" :label-col="{span: 3}"
                    :wrapper-col="{span: 19}">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="selectCondition.from.name">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="配置">
          <br>
          <a-row style="margin-bottom: 10px">
            <a-col :span="3">
              左值
            </a-col>
            <a-col :span="6">
              <a-select
                  :value="selectCondition.from.leftValue.type===0?'PARAMETER':(selectCondition.from.leftValue.type===1?'VARIABLE':selectCondition.from.leftValue.valueType)"
                  placeholder="请选择"
                  @change="leftValueTypeChange">
                <a-select-option value="PARAMETER">参数</a-select-option>
                <a-select-option value="VARIABLE">变量</a-select-option>
                <a-select-option value="BOOLEAN">布尔</a-select-option>
                <a-select-option value="COLLECTION">集合</a-select-option>
                <a-select-option value="STRING">字符串</a-select-option>
                <a-select-option value="NUMBER">数值</a-select-option>
                <a-select-option value="DATE">日期</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="1"/>
            <a-col :span="14">

              <a-select
                  v-if="selectCondition.from.leftValue.type===0||selectCondition.from.leftValue.type===1"
                  show-search
                  :value="searchSelect.value"
                  placeholder="请输入关键字进行搜索"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="conditionLeftSearch"
                  @change="conditionLeftChange"
              >
                <a-select-option v-for="d in searchSelect.data" :value="d.id" :key="d.id"
                                 @click.native="conditionLeftSearchOptionClick(d)">
                  {{ d.name }}
                </a-select-option>
              </a-select>

              <a-select
                  v-else-if="selectCondition.from.leftValue.valueType==='BOOLEAN'"
                  defaultValue="true"
                  v-model="selectCondition.from.leftValue.value" placeholder="请选择数据">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number
                  v-else-if="selectCondition.from.leftValue.valueType==='NUMBER'"
                  v-model="selectCondition.from.leftValue.value" style="width: 100%"/>
              <a-date-picker
                  v-else-if="selectCondition.from.leftValue.valueType==='DATE'"
                  show-time
                  style="width: 100%"></a-date-picker>
              <a-input v-else
                       v-model="selectCondition.from.leftValue.value"></a-input>
            </a-col>
          </a-row>

          <a-row style="margin-bottom: 10px">
            <a-col :span="3">
              运算符
            </a-col>
            <a-col :span="6">
              <a-select placeholder="请选择">
                <a-select-option v-for="op in selectCondition.operators" :value="op.name" :key="op.name">
                  {{ op.explanation }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="15"></a-col>
          </a-row>

          <a-row>
            <a-col :span="3">
              右值
            </a-col>
            <a-col :span="6">
              <a-select v-model="selectCondition.from.rightValue.valueType">
                <a-select-option value="PARAMETER">参数</a-select-option>
                <a-select-option value="VARIABLE">变量</a-select-option>
                <a-select-option value="BOOLEAN">布尔</a-select-option>
                <a-select-option value="COLLECTION">集合</a-select-option>
                <a-select-option value="STRING">字符串</a-select-option>
                <a-select-option value="NUMBER">数值</a-select-option>
                <a-select-option value="DATE">日期</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="1"/>
            <a-col :span="14">
              <a-select v-if="selectCondition.from.rightValue.valueType==='BOOLEAN'"
                        v-model="selectCondition.from.rightValue.value" placeholder="请选择数据 ">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number v-else-if="selectCondition.from.rightValue.valueType==='NUMBER'"
                              v-model="selectCondition.from.rightValue.value" style="width: 100%"/>
              <a-date-picker v-else-if="selectCondition.from.rightValue.valueType==='DATE'" show-time
                             style="width: 100%"></a-date-picker>
              <a-input v-else v-model="selectCondition.from.rightValue.value"></a-input>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="description">
          <a-textarea readOnly :value="selectCondition.from.description" :rows="3"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>


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
        :mask="true"
        :zIndex="999"
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
// api
import {saveOrUpdate, deleteConditionGroup} from '@/services/conditionGroup'
import {getRuleConfig} from '@/services/generalRule'
//import {listInputParameter} from '@/services/inputParameter'
import {selectSearchVariableOrElement} from '@/utils/selectSearch'


export default {
  name: "Config",
  components: {PageLayout, FooterToolBar, InputParameter},
  data() {
    return {
      generalRule: {
        id: 215,
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
          options: []
        },
        defaultAction: {
          enableDefaultAction: 1,
          value: undefined,
          valueName: null,
          valueType: 'NUMBER',
          type: null,
          loading: false,
          options: [],
        },
      },
      footer: {
        loading: false,
      },
      rules: {},
      drawer: {
        visible: false
      },
      selectCondition: {
        open: false,
        confirmLoading: false,
        operators: this.getSymbolByValueType('STRING'),
        from: {
          id: null,
          name: null,
          description: null,
          leftValue: {
            type: 2,
            valueType: '',
            value: ''
          },
          rightValue: {
            type: null,
            valueType: '',
            value: ''
          }
        }
      },
      searchSelect: {
        data: [],
        value: undefined,
      }
    }
  },
  mounted() {
    this.generalRule.id = this.$route.query.id;
    this.getRuleConfig();
  },
  methods: {
    conditionLeftSearch(value) {
      selectSearchVariableOrElement(value, data => (this.searchSelect.data = data), this.selectCondition.from.leftValue.type, null);
    },
    conditionLeftChange(value) {
      console.log(value);
      this.searchSelect.value = value;
    },
    conditionLeftSearchOptionClick(d) {
      console.log(d);
      this.selectCondition.from.leftValue.value = d.value;
      this.selectCondition.from.leftValue.valueType = d.valueType;
      this.selectCondition.operators = this.getSymbolByValueType(d.valueType)
    },
    /**
     * 条件左值类型修改
     */
    leftValueTypeChange(valueType) {
      this.selectCondition.from.leftValue.value = '';
      this.selectCondition.from.leftValue.valueType = valueType;
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.leftValue.type = 0;
        // 参数的类型
        this.selectCondition.from.leftValue.valueType = '';
        // 运算符待确认 等远程搜索到回显
        this.selectCondition.operators = []
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.leftValue.type = 1;
        // 变量的类型
        this.selectCondition.from.leftValue.valueType = '';
        // 运算符待确认 等远程搜索到回显
        this.selectCondition.operators = []
      } else {
        this.selectCondition.from.leftValue.type = 2;
        // 根据左值更改运算符
        this.selectCondition.operators = this.getSymbolByValueType(valueType)
      }
      //左面发生改变，右边也改变  如果值类型相同，则不需要更改
      if (valueType !== this.selectCondition.from.rightValue.valueType) {
        this.selectCondition.from.rightValue = {
          valueType: '',
          type: null,
          value: ''
        }
      }
      // 清空远程搜索缓存
      this.searchSelect.data = []
      this.searchSelect.value = ''
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
    previous() {
      this.$router.push({path: '/generalRuleDefinition', query: {id: this.generalRule.id}})
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
      this.selectCondition.open = true;
    },
    addConditionOk() {
      this.selectCondition.confirmLoading = true;


      this.selectCondition.confirmLoading = false;
      this.selectCondition.open = false;
    },
    addConditionHandleCancel() {
      this.selectCondition.open = false;
    },
    addConditionGroup() {
      // 增加一个条件组
      let newOrderNo = 1;
      if (this.generalRule.conditionGroup != null) {
        let length = this.generalRule.conditionGroup.length;
        let conditionGroupElement = this.generalRule.conditionGroup[length - 1];
        if (conditionGroupElement !== undefined) {
          newOrderNo = conditionGroupElement.orderNo + 1;
        }
      } else {
        this.generalRule.conditionGroup = [];
      }
      let newConditionGroup = {
        id: null,
        name: "条件组",
        ruleId: this.generalRule.ruleId,
        orderNo: newOrderNo,
        conditionGroupCondition: []
      };
      saveOrUpdate(newConditionGroup).then(res => {
        // 回显的id
        if (res.data.code === 200) {
          newConditionGroup.id = res.data.data;
          this.generalRule.conditionGroup.push(newConditionGroup);
        } else {
          this.$message.error("添加条件组失败");
        }
      });
    },
    deleteConditionGroup(cg) {
      // 删除条件组
      deleteConditionGroup({id: cg.id}).then(res => {
        console.log(res)
      });
      this.generalRule.conditionGroup.forEach((value, index) => {
        if (value.id === cg.id) {
          this.generalRule.conditionGroup.splice(index, 1);
        }
      });
    },
    getRuleConfig() {
      this.loading = true;
      getRuleConfig({
        "id": this.generalRule.id
      }).then(res => {
        let da = res.data.data;
        if (da != null) {
          this.generalRule = da;
        }
        this.loading = false;
      });
    },
    getSymbolExplanation(name) {
      switch (name) {
        case "EQ":
          return "等于";
        case "NE":
          return "不等于";
        case "GT":
          return "大于";
        case "LT":
          return "小于";
        case "GE":
          return "大于等于";
        case "LE":
          return "小于等于";
        case "CONTAIN":
          return "包含";
        case "NOT_CONTAIN":
          return "不包含";
        case "IN":
          return "在";
        case "NOT_IN":
          return "不在";
        case "STARTS_WITH":
          return "以..开始";
        case "ENDS_WITH":
          return "以..结束";
      }
    },
    getSymbolByValueType(valueType) {
      switch (valueType) {
        case "STRING":
          return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
            "explanation": "不等于",
            "name": "NE",
            "symbol": "!="
          }, {"explanation": "包含", "name": "CONTAIN", "symbol": "contain"}, {
            "explanation": "以..结束",
            "name": "ENDS_WITH",
            "symbol": "ends with"
          }, {"explanation": "以..开始", "name": "STARTS_WITH", "symbol": "starts with"}];
        case "BOOLEAN":
          return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
            "explanation": "不等于",
            "name": "NE",
            "symbol": "!="
          }];
        case "NUMBER":
          return [{"explanation": "大于", "name": "GT", "symbol": ">"}, {
            "explanation": "小于",
            "name": "LT",
            "symbol": "<"
          }, {"explanation": "等于", "name": "EQ", "symbol": "=="}, {
            "explanation": "不等于",
            "name": "NE",
            "symbol": "!="
          }, {"explanation": "大于等于", "name": "GE", "symbol": ">="}, {
            "explanation": "小于等于",
            "name": "LE",
            "symbol": "<="
          }];
        case "COLLECTION":
          return [{"explanation": "等于", "name": "EQ", "symbol": "=="}, {
            "explanation": "在",
            "name": "IN",
            "symbol": "in"
          }, {"explanation": "不在", "name": "NOT_IN", "symbol": "not in"}, {
            "explanation": "包含",
            "name": "CONTAIN",
            "symbol": "contain"
          }, {"explanation": "不包含", "name": "NOT_CONTAIN", "symbol": "not contain"}];
        case "DATE":
          return [{"explanation": "大于", "name": "GT", "symbol": ">"}, {
            "explanation": "小于",
            "name": "LT",
            "symbol": "<"
          }, {"explanation": "等于", "name": "EQ", "symbol": "=="}, {
            "explanation": "不等于",
            "name": "NE",
            "symbol": "!="
          }, {"explanation": "大于等于", "name": "GE", "symbol": ">="}, {
            "explanation": "小于等于",
            "name": "LE",
            "symbol": "<="
          }];
      }
    }
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
  top: 2px;
  font-size: 18px;
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


.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
