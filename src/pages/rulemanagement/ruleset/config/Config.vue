<template>
  <div>
    <page-layout>

      <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect"/>

      <a-card title="规则集配置" :bordered="false" @contextmenu="onContextmenu">
        <span slot="extra" style="margin-left: 16px;">
                    <a-popover title="当前编辑人员" trigger="click" arrow-point-at-center>
                        <template slot="content">
                        <a-list item-layout="horizontal" :data-source="[{
    title: '张三',
  },
  {
    title: '里斯',
  }]">
                          <a-list-item slot="renderItem" slot-scope="item">
                            <a-list-item-meta
                                description="我新增了一个条件组（最后一次操作记录）"
                            >
                              <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
                              <a-avatar
                                  slot="avatar"
                                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              />
                            </a-list-item-meta>
                          </a-list-item>
                        </a-list>
                        </template>
                          <a-icon type="usergroup-add"
                                  style="font-size: 18px"></a-icon>
                    </a-popover>
        </span>
        <vue-scroll :ops="ops" style="width:100%;height:100%">
          <a-form-model ref="ruleSetForm" :model="ruleSet">
            <a-row :style="isMobile?'width:1000px;margin: 0 auto':''">
              <a-col :span="1"></a-col>
              <a-col :span="22">
                <a-card title="规则集" class="rule_set" size="small">

                  <a-skeleton v-if="ruleSet.ruleSet.length===0" :paragraph="{ rows: 3 }"/>

                  <a-spin :spinning="ruleMoveLoading">
                    <task-group title="规则" :group="ruleSet.id"
                                handle=".ruleMover"
                                :rule-set-id="ruleSet.id"
                                :loading.sync="ruleMoveLoading"
                                :data-list="ruleSet.ruleSet">
                      <a-card v-for="(rs,rsi) in ruleSet.ruleSet" :key="rs.id" size="small" hoverable
                              style="margin-bottom: 10px;">

                        <div slot="title" style="margin-right: 16px;padding-left: 2px;">
                          <a-input class="conditionGroupNameInput"
                                   style="padding: 0;border: none;background: none;width: auto"
                                   @blur="updateRuleName(rs)"
                                   :placeholder="`规则${rsi}`" v-model="rs.name"/>
                        </div>

                        <a-icon :type="rs.fold?'right':'down'" class="dynamic-delete-button"
                                @click.native="rs.fold=!rs.fold"
                                style="font-size: 18px;margin-right: 10px;"
                                slot="extra"/>

                        <a-icon type="drag" class="dynamic-delete-button ruleMover"
                                style="font-size: 18px;margin-right: 10px;"
                                slot="extra"/>

                        <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px"
                                slot="extra"
                                @click="deleteRule(rs,ruleSet.ruleSet)"></a-icon>

                        <div v-show="!rs.fold">
                          <a-skeleton v-if="ruleSet.ruleSet.length===0" :paragraph="{ rows: 3 }"/>
                          <a-card title="条件集" class="condition_set" size="small">
                            <a-skeleton v-if="rs.conditionGroup.length===0" :paragraph="{ rows: 3 }"/>
                            <a-spin :spinning="conditionMoveLoading">

                              <task-group title="条件集" :group="rs.id"
                                          handle=".mover"
                                          :rule-id="rs.id"
                                          :loading.sync="conditionMoveLoading"
                                          :data-list="rs.conditionGroup">
                                <a-card :bordered="false" size="small"
                                        v-for="(cg,cgi) in rs.conditionGroup"
                                        :key="cg.id">

                                  <div slot="title" style="margin-right: 16px;padding-left: 2px;">
                                    <a-input class="conditionGroupNameInput"
                                             style="padding: 0;border: none;background: none;width: auto"
                                             @blur="updateConditionGroupName(cg,rs)"
                                             :placeholder="`条件组${cgi}`" v-model="cg.name"/>
                                  </div>

                                  <a-icon type="drag" class="dynamic-delete-button mover"
                                          style="font-size: 18px;margin-right: 10px;"
                                          slot="extra"/>

                                  <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px"
                                          slot="extra"
                                          @click="deleteConditionGroup(rs,cg)"></a-icon>

                                  <a-skeleton v-if="cg.conditionGroupCondition.length===0"
                                              :paragraph="{ rows: 2 }"/>
                                  <task-group :title="cg.name" :group="cg.id"
                                              :data-list="rs.conditionGroup"
                                              :id="cg.id"
                                              :loading.sync="conditionMoveLoading">
                                    <a-alert closable
                                             style="border:none;padding: 6px 30px 6px 6px;margin-bottom: 10px"
                                             v-for="cgc in cg.conditionGroupCondition"
                                             :key="cgc.id"
                                             @dblclick.native="$refs.modal.editCondition(cg,cgc)"
                                             @close="deleteCondition(cg.conditionGroupCondition,cgc.id,cgc.condition.id)"
                                             class="conditionItem task-item">
                                      <p slot="description" style="margin-bottom: 0;">
                                        <a-tag color="blue"
                                               style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                          （{{ cgc.condition.name }}）
                                        </a-tag>
                                        <a-tag color="cyan"
                                               style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                          {{
                                            getTypeName(cgc.condition.config.leftValue)
                                          }}
                                        </a-tag>
                                        {{ getViewValue(cgc.condition.config.leftValue) }}
                                        &nbsp;
                                        <a-tag color="orange"
                                               style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                          {{ getSymbolExplanation(cgc.condition.config.symbol) }}
                                        </a-tag>
                                        <a-tag color="cyan"
                                               style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                                          {{
                                            getTypeName(cgc.condition.config.rightValue)
                                          }}
                                        </a-tag>
                                        {{ getViewValue(cgc.condition.config.rightValue) }}
                                      </p>
                                    </a-alert>
                                  </task-group>


                                  <br>

                                  <a-button type="dashed" style="width: 50%;display:block;margin:0 auto"
                                            @click="$refs.modal.addCondition(cg)">
                                    <a-icon type="plus" style="color: #777;"/>
                                    添加条件
                                  </a-button>
                                </a-card>
                              </task-group>
                            </a-spin>

                            <a-button type="dashed" style="width: 100%" @click="addConditionGroup(rs)">
                              <a-icon type="plus" style="color: #777;"/>
                              添加条件组
                            </a-button>
                          </a-card>
                          <br>
                          <a-card title="结果" size="small">
                            <a-row>
                              <a-col :span="5">
                                <a-form-model-item :prop="`ruleSet.${rsi}.action.type`"
                                                   :rules="{
                                          required: true,
                                          message: '请选择结果类型',
                                          trigger: ['change', 'blur'],
                                        }">
                                  <a-select style="width:100%"
                                            placeholder="请选择结果类型"
                                            :value="valueType(rs.action)"
                                            @change="valueType=>{actionValueTypeChange(valueType,rs)}">
                                    <a-select-option value="PARAMETER">参数</a-select-option>
                                    <a-select-option value="VARIABLE">变量</a-select-option>
                                    <a-select-option value="BOOLEAN">布尔</a-select-option>
                                    <a-select-option value="COLLECTION">集合</a-select-option>
                                    <a-select-option value="STRING">字符串</a-select-option>
                                    <a-select-option value="NUMBER">数值</a-select-option>
                                    <a-select-option value="DATE">日期</a-select-option>
                                  </a-select>
                                </a-form-model-item>
                              </a-col>
                              <a-col :span="1"></a-col>
                              <a-col :span="18">
                                <a-form-model-item :prop="`ruleSet.${rsi}.action.value`"
                                                   :rules="{
                                          required: true,
                                          message: '请输入结果值',
                                          trigger: ['change', 'blur'],
                                        }">
                                  <a-select
                                      v-if="rs.action.type===0||rs.action.type===1||rs.action.type===4"
                                      show-search
                                      :disabled="rs.action.type==null"
                                      :value="rs.action.valueName"
                                      placeholder="请输入关键字进行搜索"
                                      :default-active-first-option="false"
                                      :show-arrow="false"
                                      :filter-option="false"
                                      :not-found-content="null"
                                      @search="(value)=>{actionSearch(value,rs)}"
                                  >
                                    <a-select-option v-for="d in actionSearchSelect.data" :value="d.id"
                                                     :key="d.id"
                                                     @click.native="actionSearchOptionClick(d,rs)">
                                      {{ d.name }}
                                    </a-select-option>
                                  </a-select>

                                  <a-select
                                      :disabled="!rs.action.type"
                                      v-else-if="rs.action.valueType==='BOOLEAN'"
                                      defaultValue="true"
                                      @blur="saveAction(rs)"
                                      style="width: 100%"
                                      v-model="rs.action.value" placeholder="请选择数据">
                                    <a-select-option value="true">true</a-select-option>
                                    <a-select-option value="false">false</a-select-option>
                                  </a-select>
                                  <a-input-number
                                      :disabled="!rs.action.type"
                                      @blur="saveAction(rs)"
                                      v-else-if="rs.action.valueType==='NUMBER'"
                                      v-model="rs.action.value" style="width: 100%"/>
                                  <a-date-picker
                                      :disabled="!rs.action.type"
                                      @openChange="v=>{actionValueDatePickerOpenChange(v,rs)}"
                                      v-else-if="rs.action.valueType==='DATE'"
                                      show-time
                                      @change="(date,dateString)=>(datePickerChange(rs.action,date,dateString))"
                                      format="YYYY-MM-DD hh:mm:ss"
                                      v-model="rs.action.value"
                                      style="width: 100%"></a-date-picker>
                                  <a-input v-else
                                           :disabled="!rs.action.type"
                                           @blur="saveAction(rs)"
                                           v-model="rs.action.value"></a-input>
                                </a-form-model-item>
                              </a-col>
                            </a-row>

                          </a-card>
                        </div>

                      </a-card>
                    </task-group>
                  </a-spin>
                  <a-button type="dashed" style="width: 100%" @click="addRule()">
                    <a-icon type="plus" style="color: #777;"/>
                    添加规则
                  </a-button>
                </a-card>
                <br>
                <br>

                <a-card title="默认规则" size="small">
                  <a-switch
                      @change="enableDefaultActionChange"
                      :checked="ruleSet.enableDefaultRule===0"/>
                  <br> <br>
                  <a-row>
                    <a-col :span="5">
                      <a-form-model-item style="margin-bottom: 0;" prop="defaultRule.action.type"
                                         :rules="ruleSet.enableDefaultRule===0?{
                                                        required: true,
                                                        message: '请选择默认结果类型',
                                                        trigger: ['change', 'blur'],
                                                      }:{required:false}">
                        <a-select style="width:100%"
                                  placeholder="请选择类型"
                                  :value="valueType(ruleSet.defaultRule.action)"
                                  @change="defaultActionValueTypeChange"
                        >
                          <a-select-option value="PARAMETER">参数</a-select-option>
                          <a-select-option value="VARIABLE">变量</a-select-option>
                          <a-select-option value="GENERAL_RULE">普通规则</a-select-option>
                          <a-select-option value="BOOLEAN">布尔</a-select-option>
                          <a-select-option value="COLLECTION">集合</a-select-option>
                          <a-select-option value="STRING">字符串</a-select-option>
                          <a-select-option value="NUMBER">数值</a-select-option>
                          <a-select-option value="DATE">日期</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="1"></a-col>
                    <a-col :span="18">
                      <a-form-model-item style="margin-bottom: 0;" prop="defaultRule.action.value"
                                         :rules="ruleSet.enableDefaultRule===0?{
                                                        required: true,
                                                        message: '请输入默认结果值',
                                                        trigger: ['change', 'blur'],
                                                      }:{required:false}">
                        <a-select
                            v-if="ruleSet.defaultRule.action.type===0||ruleSet.defaultRule.action.type===1||ruleSet.defaultRule.action.type===4||ruleSet.defaultRule.action.type===10"
                            show-search
                            style="width: 100%"
                            :disabled="ruleSet.defaultRule.action.type==null"
                            :value="ruleSet.defaultRule.action.valueName"
                            placeholder="请输入关键字进行搜索"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="defaultActionSearch"
                        >
                          <a-select-option v-for="d in actionSearchSelect.data" :value="d.id"
                                           :key="d.id"
                                           @click.native="defaultActionSearchOptionClick(d)">
                            {{ d.name }}
                          </a-select-option>
                        </a-select>

                        <a-select
                            :disabled="!ruleSet.defaultRule.action.type"
                            v-else-if="ruleSet.defaultRule.action.valueType==='BOOLEAN'"
                            defaultValue="true"
                            @blur="saveDefaultRule"
                            style="width: 100%"
                            v-model="ruleSet.defaultRule.action.value" placeholder="请选择数据">
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                        <a-input-number
                            @blur="saveDefaultRule"
                            :disabled="!ruleSet.defaultRule.action.type"
                            v-else-if="ruleSet.defaultRule.action.valueType==='NUMBER'"
                            v-model="ruleSet.defaultRule.action.value" style="width: 100%"/>
                        <a-date-picker
                            :disabled="!ruleSet.defaultRule.action.type"
                            v-else-if="ruleSet.defaultRule.action.valueType==='DATE'"
                            show-time
                            @openChange="defaultRuleValueDatePickerOpenChange"
                            @change="(date,dateString)=>(datePickerChange(ruleSet.defaultRule.action,date,dateString))"
                            format="YYYY-MM-DD hh:mm:ss"
                            v-model="ruleSet.defaultRule.action.value"
                            style="width: 100%"></a-date-picker>
                        <a-input v-else
                                 @blur="saveDefaultRule"
                                 :disabled="!ruleSet.defaultRule.action.type"
                                 v-model="ruleSet.defaultRule.action.value"></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>

                <br>
                <br>
                <a-card title="设置" size="small">
                  <a-form-model-item style="margin-bottom: 0;" prop="strategyType" required>
                    <a-select v-model="ruleSet.strategyType" @change="updateStrategyType">
                      <a-select-option :value="1">顺序执行所有规则</a-select-option>
                      <a-select-option :value="2">当有规则被命中时终止</a-select-option>
                      <a-select-option :value="3">只执行第一个规则</a-select-option>
                      <a-select-option :value="4">当有规则不成立时终止</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-card>
              </a-col>
              <a-col :span="1"></a-col>
            </a-row>
          </a-form-model>
        </vue-scroll>
        <br>
        <br>
        <br>
      </a-card>
    </page-layout>


    <ConditionModal ref="modal" :dataId="ruleSet.id" :dataType="dataType"></ConditionModal>

    <footer-tool-bar>
      <a-button type="primary" @click="nextStep()" :loading="footer.nextStepLoading">预览发布</a-button>
    </footer-tool-bar>

  </div>
</template>

<script>
import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";
import ConditionModal from "@/pages/rulemanagement/builtIncomponents/ConditionModal";

import Contextmenu from '@/components/menu/Contextmenu'
// api
import {saveOrUpdate, deleteConditionGroup} from '@/services/conditionGroup'
import {
  getRuleSetConfig,
  updateStrategyType,
  generationRelease,
  saveDefaultRule,
  defaultRuleSetSwitch
} from '@/services/ruleSet'
import {deleteCondition} from '@/services/conditionGroupCondition'
import {deleteRuleSetRule, saveRuleAndBindRuleSet, saveAction, saveOrUpdateRule} from '@/services/rule'


import {selectSearch} from '@/utils/selectSearch'
import {getSymbolByValueType, getSymbolExplanation} from '@/utils/symbol'
import moment from 'moment';
import {mapState} from "vuex";
import TaskGroup from '@/components/task/TaskGroup'
import {getTypeName, valueType} from '@/utils/value-type'

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar, Contextmenu, TaskGroup, ConditionModal},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      //条件组loading
      conditionMoveLoading: false,
      ruleMoveLoading: false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
          background: "#F5F5F5",//滚动条颜色
          opacity: 0.5,//滚动条透明度
          "overflow-x": "hidden"
        }
      },
      menuVisible: false,
      loading: true,
      dataType: 1,
      ruleSet: {
        "id": null,
        "name": null,
        "code": null,
        "description": null,
        "workspaceId": null,
        "workspaceCode": "test",
        "ruleSet": [],
        "strategyType": null,
        "enableDefaultRule": null,
        defaultRule: {
          id: null,
          name: "默认规则",
          conditionGroup: [], //扩展
          action: {
            value: undefined,
            valueName: null,
            valueType: null,
            type: null,
          }
        }
      },
      actionSearchSelect: {
        data: [],
        value: undefined,
      },
      footer: {
        nextStepLoading: false,
      },
      drawer: {
        visible: false
      },
      selectConditionLeftSearchSelect: {
        data: [],
        value: undefined,
      },
      selectConditionRightSearchSelect: {
        data: [],
        value: undefined,
      },
    }
  },
  mounted() {
    this.ruleSet.id = this.id
    this.getRuleSetConfig();
  },
  computed: {
    ...mapState('setting', ['isMobile']),
    menuItemList() {
      return [
        {key: '1', icon: 'appstore', text: "组件"},
        {key: '2', icon: 'setting', text: "设置"},
      ]
    },
  },
  methods: {
    valueType(v) {
      return valueType(v);
    },
    updateRuleName(rs) {
      saveOrUpdateRule({
        id: rs.id,
        name: rs.name
      })
    },
    updateStrategyType(type) {
      updateStrategyType({
        id: this.ruleSet.id,
        strategyType: type
      }).then(res => {
        if (res.data.data) {
          this.$message.success("更新执行策略成功");
        }
      })
    },
    deleteRule(rs, ruleSetList) {
      let _this = this
      deleteRuleSetRule({id: rs.id}).then(res => {
        if (res.data.data) {
          ruleSetList.forEach((value, index) => {
            if (value.id === rs.id) {
              ruleSetList.splice(index, 1);
            }
          });
          _this.$message.success("删除规则成功");
        }
      })

    },
    defaultActionValueTypeChange(valueType) {
      this.ruleSet.defaultRule.action = {
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.ruleSet.defaultRule.action.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.ruleSet.defaultRule.action.type = 1;
      } else if (valueType === 'GENERAL_RULE') {
        this.ruleSet.defaultRule.action.type = 10;
      } else {
        this.ruleSet.defaultRule.action.valueType = valueType;
        this.ruleSet.defaultRule.action.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
    },
    enableDefaultActionChange() {
      let defaultAction = this.ruleSet.defaultRule.action;
      if (this.ruleSet.enableDefaultRule === 0) {
        this.ruleSet.enableDefaultRule = 1;
      } else {
        // 如果开启默认规则，判断是否填写，如果没有填写，手动触发提示错误
        if (defaultAction.type == null) {
          this.$refs['ruleSetForm'].fields[0].validateMessage = '请选择默认结果类型'
          this.$refs['ruleSetForm'].fields[0].validateState = 'error'
          return;
        }
        if (defaultAction.value == null) {
          this.$refs['ruleSetForm'].fields[1].validateMessage = '请输入默认结果值'
          this.$refs['ruleSetForm'].fields[1].validateState = 'error'
          return;
        }
        this.ruleSet.enableDefaultRule = 0;
      }
      defaultRuleSetSwitch({
        ruleSetId: this.ruleSet.id,
        enableDefaultRule: this.ruleSet.enableDefaultRule
      }).then(res => {
        console.log(res);
        if (res.data.data) {
          this.$message.success(this.ruleSet.enableDefaultRule === 0 ? '默认结果已开启' : '默认结果已关闭');
        }
      })
    },
    onContextmenu(e) {
      if (e) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    onMenuSelect(key, target, pageKey) {
      console.log(pageKey)
      switch (key) {
        case '1':
          alert('暂不支持')
          break
        case '2':
          alert('暂不支持')
          break
        default:
          break
      }
    },
    datePickerChange(v, date) {
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    saveAction(rs) {
      if (rs.action.type == null) {
        return;
      }
      if (!rs.action.value) {
        return;
      }
      if (!rs.action.valueType) {
        return;
      }
      saveAction({
        ruleId: rs.id,
        configValue: rs.action
      }).then(res => {
        if (res.data.data) {
          this.$message.success("结果保存成功");
        }
      })
    },
    saveDefaultRule() {
      if (this.ruleSet.defaultRule.action.type == null) {
        return;
      }
      if (!this.ruleSet.defaultRule.action.value) {
        return;
      }
      if (!this.ruleSet.defaultRule.action.valueType) {
        return;
      }
      saveDefaultRule({
        ruleSetId: this.ruleSet.id,
        // 绑定的默认规则id 如果没有，则执行更新并绑定
        ruleId: this.ruleSet.defaultRule.id,
        ruleBody: this.ruleSet.defaultRule
      }).then(res => {
        if (res.data.data) {
          // 绑定的默认规则
          this.ruleSet.defaultRule.id = res.data.data;
          this.$message.success("默认规则保存成功");
        }
      })
    },
    actionValueDatePickerOpenChange(s, rs) {
      if (!s) {
        this.saveAction(rs);
      }
    },
    defaultRuleValueDatePickerOpenChange(s) {
      if (!s) {
        this.saveDefaultRule();
      }
    },
    actionSearch(value, rs) {
      selectSearch({
            name: value,
            valueType: null // 查询所有类型
          }, data => (this.actionSearchSelect.data = data)
          , rs.action.type)
    },
    defaultActionSearch(value) {
      selectSearch({
            name: value,
          }, data => (this.actionSearchSelect.data = data)
          , this.ruleSet.defaultRule.action.type)
    },
    actionSearchOptionClick(d, rs) {
      let action = rs.action;
      action.value = d.id;
      action.valueType = d.valueType;
      action.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (action.type === 1 && d.type === 2) {
        action.variableValue = d.value;
      }
      this.saveAction(rs);
    },
    defaultActionSearchOptionClick(d) {
      let defaultAction = this.ruleSet.defaultRule.action;
      defaultAction.value = d.id;
      defaultAction.valueType = d.valueType;
      defaultAction.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (defaultAction.type === 1 && d.type === 2) {
        defaultAction.variableValue = d.value;
      }
      this.saveDefaultRule();
    },
    deleteCondition(cgc, conditionGroupRefId, conditionId) {
      deleteCondition({
        conditionId: conditionId,
        conditionGroupRefId: conditionGroupRefId
      }).then(res => {
        if (res.data.data) {
          // 删除掉前端数组中的数据
          cgc.forEach((value, index) => {
            if (value.condition.id === conditionId) {
              cgc.splice(index, 1);
            }
          });
          this.$message.success("删除条件成功");
        }
      })
    },
    getViewValue(v) {
      // 如果是固定值
      if (v.type === 2) {
        return v.value;
      }
      // 如果是固定值变量的 变量值
      if (v.variableValue) {
        return v.variableValue;
      }
      if (v.valueName) {
        return v.valueName;
      }
      return v.value;
    },
    actionValueTypeChange(valueType, rs) {
      rs.action = {
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        rs.action.type = 0;
      } else if (valueType === 'VARIABLE') {
        rs.action.type = 1;
      } else {
        rs.action.valueType = valueType;
        rs.action.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
      console.log(rs)
    },
    getTypeName(type) {
      return getTypeName(type);
    },
    nextStep() {
      this.$refs['ruleSetForm'].validate((valid, t) => {
        if (valid) {
          this.footer.nextStepLoading = true;
          generationRelease(this.ruleSet).then(res => {
            if (res.data.data) {
              this.footer.nextStepLoading = false;
              this.$emit("choicePage", {pageIndex: 3, id: this.ruleSet.id})
            }
          })
        } else {
          // bug修复
          Object.keys(t).forEach(key => {
            if (key.startsWith("ruleSet.")) {
              let substr = key.substr(8, key.lastIndexOf(".action") - 8);
              this.ruleSet.ruleSet[substr].fold = false;
            }
          })
          return false;
        }
      });
    },
    showDrawer() {
      this.drawer.visible = true;
    },
    onClose() {
      this.drawer.visible = false;
    },
    handleClick() {

    },
    addRule() {
      let newOrderNo = 1;
      if (this.ruleSet.ruleSet != null) {
        let length = this.ruleSet.ruleSet.length;
        let ruleSetElement = this.ruleSet.ruleSet[length - 1];
        if (ruleSetElement !== undefined) {
          newOrderNo = ruleSetElement.orderNo + 1;
        }
      } else {
        this.ruleSet.ruleSet = [];
      }
      let newRule = {
        id: null,
        name: "规则",
        orderNo: newOrderNo,
        conditionGroup: [],
        fold: false, //新增的默认展开
        action: {
          value: undefined,
          valueName: null,
          valueType: null,
          type: null,
        }
      };
      // 调用接口..
      saveRuleAndBindRuleSet({
        ruleSetId: this.ruleSet.id,
        ruleBody: newRule
      }).then(res => {
        if (res.data.data) {
          newRule.id = res.data.data;
          this.ruleSet.ruleSet.push(newRule);
          this.$message.success("添加规则成功");
        }
      })
    },
    addConditionGroup(rs) {
      // 增加一个条件组
      let newOrderNo = 1;
      if (rs.conditionGroup != null) {
        let length = rs.conditionGroup.length;
        let conditionGroupElement = rs.conditionGroup[length - 1];
        if (conditionGroupElement !== undefined) {
          newOrderNo = conditionGroupElement.orderNo + 1;
        }
      } else {
        rs.conditionGroup = [];
      }
      let newConditionGroup = {
        id: null,
        name: "条件组",
        ruleId: rs.id,
        orderNo: newOrderNo,
        conditionGroupCondition: []
      };
      saveOrUpdate(newConditionGroup).then(res => {
        // 回显的id
        if (res.data.data) {
          newConditionGroup.id = res.data.data;
          rs.conditionGroup.push(newConditionGroup);
          this.$message.success("添加条件组成功");
        }
      });
    },
    updateConditionGroupName(cg, rs) {
      saveOrUpdate({
        id: cg.id,
        ruleId: rs.id,
        name: cg.name
      });
    },
    deleteConditionGroup(rs, cg) {
      // 删除条件组
      deleteConditionGroup({id: cg.id}).then(res => {
        if (res.data.data) {
          rs.conditionGroup.forEach((value, index) => {
            if (value.id === cg.id) {
              rs.conditionGroup.splice(index, 1);
            }
          });
          this.$message.success("删除条件组成功");
        }
      });
    },
    getRuleSetConfig() {
      getRuleSetConfig({
        "id": this.ruleSet.id
      }).then(res => {
        let da = res.data.data;
        if (da != null) {
          da.ruleSet.forEach((f) => {
            // 折叠，默认只展开最后一个
            //f.fold = da.ruleSet.length - 1 !== i;
            // 如果只有一个的时候展开，其他情况默认全部折叠
            f.fold = da.ruleSet.length !== 1;
          })
          this.ruleSet = da;
        }
      }).finally(() => {
        this.loading = false
      });
    },
    getSymbolExplanation(name) {
      return getSymbolExplanation(name);
    },
    getSymbolByValueType(valueType) {
      return getSymbolByValueType(valueType);
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

.rule_set {
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

// 滚动条位置
/deep/ .__bar-is-vertical {
  right: -1px !important;
}

// 隐藏横向滚动条
/deep/ .__bar-is-horizontal {
  display: none !important;
}
</style>
