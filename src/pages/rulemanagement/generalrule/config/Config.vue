<template>
  <div>
    <page-layout>
      <a-card title="规则配置" :bordered="false">
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

        <div class="openLeft">
          <a-icon type="appstore" style="font-size: 19px;color: #777;" @click="showDrawer"/>
          <br>
          <br>
          <a-icon type="setting" style="font-size: 19px;color: #777;"/>
        </div>
        <a-row>
          <a-col :span="1"></a-col>
          <a-col :span="22">
            <a-card title="条件集" class="condition_set">

              <a-skeleton v-if="generalRule.conditionGroup.length===0" :paragraph="{ rows: 3 }"/>

              <a-card :title="cg.name" :bordered="false" v-for="cg in generalRule.conditionGroup" :key="cg.id">

                <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px" slot="extra"
                        @click="deleteConditionGroup(cg)"></a-icon>

                <a-skeleton v-if="cg.conditionGroupCondition.length===0" :paragraph="{ rows: 2 }"/>

                <a-alert closable
                         style="background-color: #f4f4f5;border:none;padding: 6px 30px 6px 6px;margin-bottom: 10px"
                         v-for="cgc in cg.conditionGroupCondition"
                         :key="cgc.id"
                         @close="deleteCondition(cg.conditionGroupCondition,cgc.id,cgc.id)"
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
                      {{ getSymbolExplanation(cgc.condition.config.symbol) }}
                    </a-tag>
                    <a-tag color="cyan" style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                      {{ getConditionNamePrefix(cgc.condition.config.rightValue.type) }}
                    </a-tag>
                    {{ getViewValue(cgc.condition.config.rightValue) }}
                  </p>
                </a-alert>
                <br>
                <a-button type="dashed" style="width: 50%;display:block;margin:0 auto" @click="addCondition(cg)">
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
                                         <a-switch
                                             :checked="generalRule.defaultAction.enableDefaultAction===0"/>
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

              <a-icon slot="extra" class="dynamic-delete-button" type="save"
                      style="font-size: 18px;margin-left: 16px;" @click="saveAction"></a-icon>

              <a-row>
                <a-col :span="5">
                  <a-select style="width:100%"
                            :value="generalRule.action.type===0?'PARAMETER':(generalRule.action.type===1?'VARIABLE':generalRule.action.valueType)"
                            @change="actionValueTypeChange"
                  >
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

                  <a-select
                      v-if="generalRule.action.type===0||generalRule.action.type===1"
                      show-search
                      :value="generalRule.action.searchSelect.value"
                      placeholder="请输入关键字进行搜索"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="actionSearch"
                  >
                    <a-select-option v-for="d in generalRule.action.searchSelect.data" :value="d.id"
                                     :key="d.id"
                                     @click.native="actionSearchOptionClick(d)">
                      {{ d.name }}
                    </a-select-option>
                  </a-select>

                  <a-select
                      v-else-if="generalRule.action.valueType==='BOOLEAN'"
                      defaultValue="true"
                      style="width: 100%"
                      v-model="generalRule.action.value" placeholder="请选择数据">
                    <a-select-option value="true">true</a-select-option>
                    <a-select-option value="false">false</a-select-option>
                  </a-select>
                  <a-input-number
                      v-else-if="generalRule.action.valueType==='NUMBER'"
                      v-model="generalRule.action.value" style="width: 100%"/>
                  <a-date-picker
                      v-else-if="generalRule.action.valueType==='DATE'"
                      show-time
                      style="width: 100%"></a-date-picker>
                  <a-input v-else
                           v-model="generalRule.action.value"></a-input>

                </a-col>
              </a-row>
            </a-card>
          </a-col>
          <a-col :span="1"></a-col>
        </a-row>
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
                  :value="selectCondition.from.config.leftValue.type===0?'PARAMETER':(selectCondition.from.config.leftValue.type===1?'VARIABLE':selectCondition.from.config.leftValue.valueType)"
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
                  v-if="selectCondition.from.config.leftValue.type===0||selectCondition.from.config.leftValue.type===1"
                  show-search
                  :value="selectCondition.from.config.leftValue.searchSelect.value"
                  placeholder="请输入关键字进行搜索"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="conditionLeftSearch"
                  @change="conditionLeftChange"
              >
                <a-select-option v-for="d in selectCondition.from.config.leftValue.searchSelect.data" :value="d.id"
                                 :key="d.id"
                                 @click.native="conditionLeftSearchOptionClick(d)">
                  {{ d.name }}
                </a-select-option>
              </a-select>

              <a-select
                  v-else-if="selectCondition.from.config.leftValue.valueType==='BOOLEAN'"
                  defaultValue="true"
                  v-model="selectCondition.from.config.leftValue.value" placeholder="请选择数据">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number
                  v-else-if="selectCondition.from.config.leftValue.valueType==='NUMBER'"
                  v-model="selectCondition.from.config.leftValue.value" style="width: 100%"/>
              <a-date-picker
                  v-else-if="selectCondition.from.config.leftValue.valueType==='DATE'"
                  show-time
                  style="width: 100%"></a-date-picker>
              <a-input v-else
                       v-model="selectCondition.from.config.leftValue.value"></a-input>
            </a-col>
          </a-row>

          <a-row style="margin-bottom: 10px">
            <a-col :span="3">
              运算符
            </a-col>
            <a-col :span="6">
              <a-select placeholder="请选择" v-model="selectCondition.from.config.symbol">
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
              <a-select
                  :value="selectCondition.from.config.rightValue.type===0?'PARAMETER':(selectCondition.from.config.rightValue.type===1?'VARIABLE':selectCondition.from.config.rightValue.valueType)"
                  placeholder="请选择"
                  @change="rightValueTypeChange"
              >
                <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null" value="PARAMETER">参数
                </a-select-option>
                <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null" value="VARIABLE">变量
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('BOOLEAN')" value="BOOLEAN">布尔</a-select-option>
                <a-select-option v-if="isRightTypeSelectView('COLLECTION')" value="COLLECTION">集合</a-select-option>
                <a-select-option v-if="isRightTypeSelectView('STRING')" value="STRING">字符串</a-select-option>
                <a-select-option v-if="isRightTypeSelectView('NUMBER')" value="NUMBER">数值</a-select-option>
                <a-select-option v-if="isRightTypeSelectView('DATE')" value="DATE">日期</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="1"/>
            <a-col :span="14">
              <a-select
                  v-if="selectCondition.from.config.rightValue.type===0||selectCondition.from.config.rightValue.type===1"
                  show-search
                  :value="selectCondition.from.config.rightValue.searchSelect.value"
                  placeholder="请输入关键字进行搜索"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="conditionRightSearch"
                  @change="conditionRightChange"
              >
                <a-select-option v-for="d in selectCondition.from.config.rightValue.searchSelect.data" :value="d.id"
                                 :key="d.id"
                                 @click.native="conditionRightSearchOptionClick(d)">
                  {{ d.name }}
                </a-select-option>
              </a-select>
              <a-select v-else-if="selectCondition.from.config.rightValue.valueType==='BOOLEAN'"
                        v-model="selectCondition.from.config.rightValue.value" placeholder="请选择数据 ">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number v-else-if="selectCondition.from.config.rightValue.valueType==='NUMBER'"
                              v-model="selectCondition.from.config.rightValue.value" style="width: 100%"/>
              <a-date-picker v-else-if="selectCondition.from.config.rightValue.valueType==='DATE'" show-time
                             style="width: 100%"></a-date-picker>
              <a-input v-else v-model="selectCondition.from.config.rightValue.value"></a-input>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="description">
          <a-textarea v-model="selectCondition.from.description" :rows="3"/>
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
          <input-parameter :data-id="parseInt(generalRule.id)" :data-type="dataType"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="变量">
          <Variable :data-id="parseInt(generalRule.id)" :data-type="dataType"/>
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
import Variable from "./Variable";
// api
import {saveOrUpdate, deleteConditionGroup} from '@/services/conditionGroup'
import {getRuleConfig, saveAction, generationRelease} from '@/services/generalRule'
import {saveConditionAndBindGroup, deleteCondition} from '@/services/conditionGroupCondition'

//import {listInputParameter} from '@/services/inputParameter'
import {selectSearch} from '@/utils/selectSearch'

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar, InputParameter, Variable},
  data() {
    return {
      loading: true,
      dataType: 0,
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
      rules: {},
      drawer: {
        visible: false
      },
      selectCondition: {
        currentConditionGroup: null,
        open: false,
        confirmLoading: false,
        operators: this.getSymbolByValueType('STRING'),
        from: {
          id: null,
          name: null,
          description: null,
          config: {
            leftValue: {
              type: null,
              valueType: null,
              value: '',
              valueName: null,
              variableValue: null,
              searchSelect: {
                data: [],
                value: undefined,
              }
            },
            symbol: null,
            rightValue: {
              type: null,
              valueType: null,
              value: '',
              valueName: null,
              variableValue: null,
              searchSelect: {
                data: [],
                value: undefined,
              }
            }
          }
        }
      },
    }
  },
  mounted() {
    this.generalRule.id = this.$route.query.id;
    this.getRuleConfig();
  },
  methods: {
    saveAction() {
      saveAction({
        ruleId: this.generalRule.ruleId,
        configValue: this.generalRule.action
      }).then(res => {
        if (res.data.data) {
          this.$message.success("结果保存成功");
        }
      })
    },
    actionSearch(value) {
      selectSearch({
            name: value,
            dataId: this.generalRule.id,
            dataType: this.dataType,
            valueType: null // 查询所有类型
          }, data => (this.generalRule.action.searchSelect.data = data)
          , this.generalRule.action.type)
    },
    actionSearchOptionClick(d) {
      this.generalRule.action.value = d.id;
      this.generalRule.action.valueType = d.valueType;
      this.generalRule.action.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (this.generalRule.action.type === 1 && d.type === 2) {
        this.generalRule.action.variableValue = d.value;
      }
    },
    deleteCondition(cgc, conditionGroupRefId, conditionId) {
      deleteCondition({
        conditionId: conditionId,
        conditionGroupRefId: conditionGroupRefId
      }).then(res => {
        console.log(res)
        // 删除掉前端数组中的数据
        // cg.conditionGroupCondition
        cgc.forEach((value, index) => {
          if (value.condition.id === conditionId) {
            cgc.splice(index, 1);
          }
        });
      })
    },
    conditionLeftSearch(value) {
      selectSearch({
            name: value,
            dataId: this.generalRule.id,
            dataType: this.dataType,
            valueType: null // 查询所有类型
          }, data => (this.selectCondition.from.config.leftValue.searchSelect.data = data)
          , this.selectCondition.from.config.leftValue.type)
    },
    conditionLeftChange(value) {
      this.selectCondition.from.config.leftValue.searchSelect.value = value;
    },
    conditionLeftSearchOptionClick(d) {
      this.selectCondition.from.config.leftValue.value = d.id;
      this.selectCondition.from.config.leftValue.valueType = d.valueType;
      this.selectCondition.from.config.leftValue.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (this.selectCondition.from.config.leftValue.type === 1 && d.type === 2) {
        this.selectCondition.from.config.leftValue.variableValue = d.value;
      }
      this.selectCondition.operators = this.getSymbolByValueType(d.valueType)
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
    actionValueTypeChange(valueType) {
      this.generalRule.action.value = '';
      this.generalRule.action.valueName = null;
      this.generalRule.action.variableValue = null;
      this.generalRule.action.valueType = valueType;
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.generalRule.action.type = 0;
        // 参数的类型
        this.generalRule.action.valueType = '';
      } else if (valueType === 'VARIABLE') {
        this.generalRule.action.type = 1;
        // 变量的类型
        this.generalRule.action.valueType = '';
      } else {
        this.generalRule.action.type = 2;
      }
      // 清空远程搜索缓存
      this.generalRule.action.searchSelect = {
        data: [],
        value: undefined,
      }
      console.log(this.generalRule.action)
    },
    /**
     * 条件左值类型修改
     */
    leftValueTypeChange(valueType) {
      this.selectCondition.operators = []
      this.selectCondition.from.config.leftValue.value = '';
      this.selectCondition.from.config.leftValue.valueName = null;
      this.selectCondition.from.config.leftValue.variableValue = null;
      this.selectCondition.from.config.leftValue.valueType = valueType;
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.leftValue.type = 0;
        // 参数的类型
        this.selectCondition.from.config.leftValue.valueType = '';
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.leftValue.type = 1;
        // 变量的类型
        this.selectCondition.from.config.leftValue.valueType = '';
      } else {
        this.selectCondition.from.config.leftValue.type = 2;
        // 根据左值更改运算符
        this.selectCondition.operators = this.getSymbolByValueType(valueType)
      }
      //左面发生改变，右边也改变  如果值类型相同，则不需要更改
      if (valueType !== this.selectCondition.from.config.rightValue.valueType) {
        this.selectCondition.from.config.rightValue = {
          valueType: '',
          type: null,
          value: '',
          searchSelect: {
            data: [],
            value: undefined,
          }
        }
      } else {
        // 清空远程搜索缓存
        this.selectCondition.from.config.leftValue.searchSelect.data = []
        this.selectCondition.from.config.leftValue.searchSelect.value = undefined
      }
      // 删除运算符
      this.selectCondition.from.config.symbol = null;
    },
    conditionRightSearch(value) {
      selectSearch({
        name: value,
        dataId: this.generalRule.id,
        dataType: this.dataType,
        // 查询指定类型右值
        valueType: this.getRValueType(this.selectCondition.from.config.leftValue.valueType, this.selectCondition.from.config.symbol)
      }, data => (this.selectCondition.from.config.rightValue.searchSelect.data = data), this.selectCondition.from.config.rightValue.type, null);
    },
    getRValueType(valueType, symbol) {
      if (valueType == null) {
        return [];
      }
      // 如果左值为集合时
      if (valueType === 'COLLECTION' && symbol != null) {
        // 并且 只有左值为COLLECTION 运算符为CONTAIN/NOT_CONTAIN 返回所有的类型
        if (symbol === 'CONTAIN' || symbol === 'NOT_CONTAIN') {
          return ["STRING", "NUMBER", "BOOLEAN", "COLLECTION", "DATE"];
        }
      }
      return new Array(valueType);
    },
    conditionRightChange(value) {
      console.log(value);
      this.selectCondition.from.config.rightValue.searchSelect.value = value;
    },
    conditionRightSearchOptionClick(d) {
      this.selectCondition.from.config.rightValue.value = d.id;
      this.selectCondition.from.config.rightValue.valueType = d.valueType;
      this.selectCondition.from.config.rightValue.valueName = d.name;
      // 变量  d.type 如果是固定值
      if (this.selectCondition.from.config.rightValue.type === 1 && d.type === 2) {
        this.selectCondition.from.config.rightValue.variableValue = d.value;
      }
    },
    rightValueTypeChange(valueType) {
      this.selectCondition.from.config.rightValue.value = '';
      this.selectCondition.from.config.rightValue.valueName = null;
      this.selectCondition.from.config.rightValue.variableValue = null;
      this.selectCondition.from.config.rightValue.valueType = valueType;
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.rightValue.type = 0;
        // 参数的类型
        this.selectCondition.from.config.rightValue.valueType = '';
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.rightValue.type = 1;
        // 变量的类型
        this.selectCondition.from.config.rightValue.valueType = '';
      } else {
        this.selectCondition.from.config.rightValue.type = 2;
        // 根据左值更改运算符
      }
      // 清空远程搜索缓存
      this.selectCondition.from.config.rightValue.searchSelect.data = []
      this.selectCondition.from.config.rightValue.searchSelect.value = undefined
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
    isRightTypeSelectView(valueType) {
      if (this.selectCondition.from.config.leftValue.valueType === null) {
        return false;
      }
      if (this.selectCondition.from.config.leftValue.valueType === valueType) {
        return true;
      }
      // 如果左值为集合时
      if (this.selectCondition.from.config.leftValue.valueType === 'COLLECTION') {
        if (this.selectCondition.from.config.symbol === null) {
          return true;
        }
        // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
        return this.selectCondition.from.config.symbol === 'CONTAIN' || this.selectCondition.from.config.symbol === 'NOT_CONTAIN';
      }
    },
    previous() {
      this.$router.push({path: '/generalRuleDefinition', query: {id: this.generalRule.id}})
    },
    nextStep() {
      generationRelease(this.generalRule).then(res => {
        console.log(res)
        this.$router.push({path: '/generalRulePublish', query: {id: this.generalRule.id}})
      })
    },
    showDrawer() {
      this.drawer.visible = true;
    },
    onClose() {
      this.drawer.visible = false;
    },
    handleClick() {

    },
    addCondition(cg) {
      this.selectCondition.open = true;
      this.selectCondition.currentConditionGroup = cg;
      // 还原配置
      this.selectCondition.from = {
        id: null,
        name: null,
        description: null,
        config: {
          leftValue: {
            type: null,
            valueType: null,
            value: '',
            valueName: null,
            variableValue: null,
            searchSelect: {
              data: [],
              value: undefined,
            }
          },
          symbol: null,
          rightValue: {
            type: null,
            valueType: null,
            value: '',
            valueName: null,
            variableValue: null,
            searchSelect: {
              data: [],
              value: undefined,
            }
          }
        }
      }
    },
    addConditionOk() {
      this.selectCondition.confirmLoading = true;
      // 传入条件组信息，条件信息 绑定关系
      // this.selectCondition.currentConditionGroup.id;
      // 获取最后一条的orderNo
      let orderNo = 0;
      let conditionGroupCondition = this.selectCondition.currentConditionGroup.conditionGroupCondition;
      if (conditionGroupCondition.length > 0) {
        orderNo = conditionGroupCondition[conditionGroupCondition.length - 1].orderNo + 1;
      }
      // 插入一条记录
      saveConditionAndBindGroup({
        generalRuleId: this.generalRule.id,
        conditionGroupId: this.selectCondition.currentConditionGroup.id,
        orderNo: orderNo,
        addConditionRequest: this.selectCondition.from
      }).then(res => {
        this.selectCondition.confirmLoading = false;
        this.selectCondition.open = false;
        // 当前条件组内插入一条数据
        this.selectCondition.from.id = res.data.data.conditionId;
        this.selectCondition.currentConditionGroup.conditionGroupCondition.push({
          "id": res.data.data.conditionGroupConditionId,
          "orderNo": orderNo,
          "condition": this.selectCondition.from
        });
      })
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
      getRuleConfig({
        "id": this.generalRule.id
      }).then(res => {
        let da = res.data.data;
        if (da != null) {
          this.generalRule = da;
        }
      }).finally(() => {
        this.loading = false
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
