<template>
  <div>
    <page-layout>

      <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect"/>

      <a-card title="规则配置" :bordered="false" @contextmenu="onContextmenu">
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
          <a-row :style="isMobile?'width:1000px;margin: 0 auto':''">
            <a-col :span="1"></a-col>
            <a-col :span="22">
              <a-card title="条件集" class="condition_set">

                <a-skeleton v-if="generalRule.conditionGroup.length===0" :paragraph="{ rows: 3 }"/>
                <a-spin :spinning="conditionMoveLoading">

                  <task-group title="条件集" :group="generalRule.ruleId"
                              handle=".mover"
                              :rule-id="generalRule.ruleId"
                              :loading.sync="conditionMoveLoading"
                              :data-list="generalRule.conditionGroup">
                    <a-card :bordered="false"
                            v-for="(cg,cgi) in generalRule.conditionGroup"
                            :key="cg.id">

                      <div slot="title" style="margin-right: 16px;padding-left: 2px;">
                        <a-input class="conditionGroupNameInput"
                                 style="font-size: 16px;color: rgba(0, 0, 0, 0.85);padding: 0;border: none;background: none;"
                                 @blur="updateConditionGroupName(cg)"
                                 :placeholder="`条件组${cgi}`" v-model="cg.name"/>
                      </div>

                      <a-icon type="drag" class="dynamic-delete-button mover"
                              style="font-size: 18px;margin-right: 10px;"
                              slot="extra"/>

                      <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px"
                              slot="extra"
                              @click="deleteConditionGroup(cg)"></a-icon>

                      <a-skeleton v-if="cg.conditionGroupCondition.length===0"
                                  :paragraph="{ rows: 2 }"/>
                      <task-group :title="cg.name" :group="cg.id"
                                  :data-list="generalRule.conditionGroup"
                                  :id="cg.id"
                                  :loading.sync="conditionMoveLoading">
                        <a-alert closable
                                 style="border:none;padding: 6px 30px 6px 6px;margin-bottom: 10px"
                                 v-for="cgc in cg.conditionGroupCondition"
                                 :key="cgc.id"
                                 @dblclick.native="editCondition(cg,cgc)"
                                 @close="deleteCondition(cg.conditionGroupCondition,cgc.id,cgc.id)"
                                 class="conditionItem task-item">
                          <p slot="description" style="margin-bottom: 0;">
                            <a-tag color="blue"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              （{{ cgc.condition.name }}）
                            </a-tag>
                            <a-tag color="cyan"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              {{
                                getTypeName(cgc.condition.config.leftValue.type)
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
                                getTypeName(cgc.condition.config.rightValue.type)
                              }}
                            </a-tag>
                            {{ getViewValue(cgc.condition.config.rightValue) }}
                          </p>
                        </a-alert>
                      </task-group>


                      <br>

                      <a-button type="dashed" style="width: 50%;display:block;margin:0 auto"
                                @click="addCondition(cg,`addConditionForm${cgi}`)">
                        <a-icon type="plus" style="color: #777;"/>
                        添加条件
                      </a-button>
                    </a-card>
                  </task-group>
                </a-spin>
                <a-button type="dashed" style="width: 100%" @click="addConditionGroup()">
                  <a-icon type="plus" style="color: #777;"/>
                  添加条件组
                </a-button>
              </a-card>
              <br>
              <br>


              <a-form-model ref="generalRuleForm" :model="generalRule">
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
                  <a-row>
                    <a-col :span="5">
                      <a-form-model-item prop="action.type"
                                         :rules="{
                                          required: true,
                                          message: '请选择结果类型',
                                          trigger: ['change', 'blur'],
                                        }">
                        <a-select style="width:100%"
                                  placeholder="请选择结果类型"
                                  :value="valueType(generalRule.action)"
                                  @change="actionValueTypeChange">
                          <a-select-option value="PARAMETER">参数</a-select-option>
                          <a-select-option value="VARIABLE">变量</a-select-option>
                          <a-select-option value="FORMULA">表达式</a-select-option>
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
                      <a-form-model-item prop="action.value"
                                         :rules="{
                                          required: true,
                                          message: '请输入结果值',
                                          trigger: ['change', 'blur'],
                                        }">
                        <a-select
                            v-if="generalRule.action.type===0||generalRule.action.type===1||generalRule.action.type===4"
                            show-search
                            :disabled="generalRule.action.type==null"
                            :value="generalRule.action.valueName"
                            placeholder="请输入关键字进行搜索"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="actionSearch"
                        >
                          <a-select-option v-for="d in actionSearchSelect.data" :value="d.id"
                                           :key="d.id"
                                           @click.native="actionSearchOptionClick(d)">
                            {{ d.name }}
                          </a-select-option>
                        </a-select>

                        <a-select
                            :disabled="!generalRule.action.type"
                            v-else-if="generalRule.action.valueType==='BOOLEAN'"
                            defaultValue="true"
                            @blur="saveAction"
                            style="width: 100%"
                            v-model="generalRule.action.value" placeholder="请选择数据">
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                        <a-input-number
                            :disabled="!generalRule.action.type"
                            @blur="saveAction"
                            v-else-if="generalRule.action.valueType==='NUMBER'"
                            v-model="generalRule.action.value" style="width: 100%"/>
                        <a-date-picker
                            :disabled="!generalRule.action.type"
                            @openChange="actionValueDatePickerOpenChange"
                            v-else-if="generalRule.action.valueType==='DATE'"
                            show-time
                            @change="(date,dateString)=>(datePickerChange(generalRule.action,date,dateString))"
                            format="YYYY-MM-DD hh:mm:ss"
                            v-model="generalRule.action.value"
                            style="width: 100%"></a-date-picker>
                        <a-input v-else
                                 :disabled="!generalRule.action.type"
                                 @blur="saveAction"
                                 v-model="generalRule.action.value"></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>

                </a-card>

                <br>

                <a-card title="默认结果">
                  <a-switch
                      :disabled="generalRule.action.valueType==null"
                      @change="enableDefaultActionChange"
                      :checked="generalRule.defaultAction.enableDefaultAction===0"/>
                  <br> <br>
                  <a-row>
                    <a-col :span="5">
                      <a-form-model-item prop="defaultAction.type"
                                         :rules="generalRule.defaultAction.enableDefaultAction===0?{
                                          required: true,
                                          message: '请选择默认结果类型',
                                          trigger: ['change', 'blur'],
                                        }:{required:false}">
                        <a-select style="width:100%"
                                  :disabled="generalRule.action.valueType==null"
                                  placeholder="请选择类型"
                                  :value="valueType(generalRule.defaultAction)"
                                  @change="defaultActionValueTypeChange"
                        >
                          <a-select-option value="PARAMETER">参数</a-select-option>
                          <a-select-option value="VARIABLE">变量</a-select-option>
                          <a-select-option value="FORMULA">表达式</a-select-option>
                          <a-select-option value="BOOLEAN"
                                           v-if="generalRule.action.valueType==='BOOLEAN'">布尔
                          </a-select-option>
                          <a-select-option value="COLLECTION"
                                           v-if="generalRule.action.valueType==='COLLECTION'">
                            集合
                          </a-select-option>
                          <a-select-option value="STRING"
                                           v-if="generalRule.action.valueType==='STRING'">字符串
                          </a-select-option>
                          <a-select-option value="NUMBER"
                                           v-if="generalRule.action.valueType==='NUMBER'">数值
                          </a-select-option>
                          <a-select-option value="DATE"
                                           v-if="generalRule.action.valueType==='DATE'">日期
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="1"></a-col>
                    <a-col :span="18">
                      <a-form-model-item prop="defaultAction.value"
                                         :rules="generalRule.defaultAction.enableDefaultAction===0?{
                                          required: true,
                                          message: '请输入默认结果值',
                                          trigger: ['change', 'blur'],
                                        }:{required:false}">
                        <a-select
                            v-if="generalRule.defaultAction.type===0||generalRule.defaultAction.type===1||generalRule.defaultAction.type===4"
                            show-search
                            style="width: 100%"
                            :disabled="generalRule.defaultAction.type==null"
                            :value="generalRule.defaultAction.valueName"
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
                            :disabled="!generalRule.defaultAction.type"
                            v-else-if="generalRule.defaultAction.valueType==='BOOLEAN'"
                            defaultValue="true"
                            @blur="saveDefaultAction"
                            style="width: 100%"
                            v-model="generalRule.defaultAction.value" placeholder="请选择数据">
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                        <a-input-number
                            @blur="saveDefaultAction"
                            :disabled="!generalRule.defaultAction.type"
                            v-else-if="generalRule.defaultAction.valueType==='NUMBER'"
                            v-model="generalRule.defaultAction.value" style="width: 100%"/>
                        <a-date-picker
                            :disabled="!generalRule.defaultAction.type"
                            v-else-if="generalRule.defaultAction.valueType==='DATE'"
                            show-time
                            @openChange="defaultActionValueDatePickerOpenChange"
                            @change="(date,dateString)=>(datePickerChange(generalRule.defaultAction,date,dateString))"
                            format="YYYY-MM-DD hh:mm:ss"
                            v-model="generalRule.defaultAction.value"
                            style="width: 100%"></a-date-picker>
                        <a-input v-else
                                 @blur="saveDefaultAction"
                                 :disabled="!generalRule.defaultAction.type"
                                 v-model="generalRule.defaultAction.value"></a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form-model>
            </a-col>
            <a-col :span="1"></a-col>
          </a-row>
        </vue-scroll>
        <br>
        <br>
        <br>
      </a-card>
    </page-layout>

    <a-modal
        :title="selectCondition.from.id === undefined ?'创建条件':'编辑条件'"
        :mask="false"
        :visible="selectCondition.visible"
        :ok-text="selectCondition.from.id === undefined ? '确认添加' : '确认更新'"
        @ok="addConditionOk('addConditionForm')"
        @cancel="addConditionCancel"
    >
      <a-form-model style="width: 500px;"
                    ref="addConditionForm"
                    :model="selectCondition.from"
                    :label-col="{span: 3}"
                    :wrapper-col="{span: 19}">
        <a-form-model-item label="名称" prop="name"
                           style="margin-bottom: 10px;"
                           :rules="{
                                        required: true,
                                        message: '请输入条件名称',
                                        trigger: ['change', 'blur'],
                                      }">
          <a-input v-model="selectCondition.from.name">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="配置" prop="config" required style="margin-bottom: 10px;">
          <br>
          <a-row>
            <a-col :span="3">
              左值
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="config.leftValue.type"
                                 style="margin-bottom: 10px;"
                                 :rules="{
                                        required: true,
                                        message: '请选择左值类型',
                                        trigger: ['change', 'blur'],
                                      }">
                <a-select
                    :value="valueType(selectCondition.from.config.leftValue)"
                    placeholder="请选择"
                    @change="leftValueTypeChange">
                  <a-select-option value="PARAMETER">参数</a-select-option>
                  <a-select-option value="VARIABLE">变量</a-select-option>
                  <a-select-option value="FORMULA">表达式</a-select-option>
                  <a-select-option value="BOOLEAN">布尔</a-select-option>
                  <a-select-option value="COLLECTION">集合</a-select-option>
                  <a-select-option value="STRING">字符串</a-select-option>
                  <a-select-option value="NUMBER">数值</a-select-option>
                  <a-select-option value="DATE">日期</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="1"/>
            <a-col :span="14">
              <a-form-model-item prop="config.leftValue.value"
                                 style="margin-bottom: 10px;"
                                 :rules="{
                                        required: true,
                                        message: '请输入左值',
                                        trigger: ['change', 'blur'],
                                      }">
                <a-select
                    v-if="selectCondition.from.config.leftValue.type===0||selectCondition.from.config.leftValue.type===1||selectCondition.from.config.leftValue.type===4"
                    show-search
                    :disabled="selectCondition.from.config.leftValue.type==null"
                    :value="selectCondition.from.config.leftValue.valueName"
                    placeholder="请输入关键字进行搜索"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    @search="conditionLeftSearch"
                    @change="conditionLeftChange"
                >
                  <a-select-option v-for="d in selectConditionLeftSearchSelect.data"
                                   :value="d.id"
                                   :key="d.id"
                                   @click.native="conditionLeftSearchOptionClick(d)">
                    {{ d.name }}
                  </a-select-option>
                </a-select>

                <a-select
                    :disabled="selectCondition.from.config.leftValue.type==null"
                    v-else-if="selectCondition.from.config.leftValue.valueType==='BOOLEAN'"
                    defaultValue="true"
                    v-model="selectCondition.from.config.leftValue.value" placeholder="请选择数据">
                  <a-select-option value="true">true</a-select-option>
                  <a-select-option value="false">false</a-select-option>
                </a-select>
                <a-input-number
                    :disabled="selectCondition.from.config.leftValue.type==null"
                    v-else-if="selectCondition.from.config.leftValue.valueType==='NUMBER'"
                    v-model="selectCondition.from.config.leftValue.value" style="width: 100%"/>
                <a-date-picker
                    :disabled="selectCondition.from.config.leftValue.type==null"
                    v-else-if="selectCondition.from.config.leftValue.valueType==='DATE'"
                    show-time
                    v-model="selectCondition.from.config.leftValue.value"
                    @change="(date,dateString)=>(datePickerChange(selectCondition.from.config.leftValue,date,dateString))"
                    style="width: 100%"></a-date-picker>
                <a-input v-else
                         :disabled="selectCondition.from.config.leftValue.type==null"
                         v-model="selectCondition.from.config.leftValue.value"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="3">
              运算符
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="config.symbol"
                                 style="margin-bottom: 10px;"
                                 :rules="{
                                        required: true,
                                        message: '请选择运算符',
                                        trigger: ['change', 'blur'],
                                      }">
                <a-select placeholder="请选择"
                          :disabled="(selectCondition.from.config.leftValue.value==null&&selectCondition.from.config.leftValue.type!==2&&selectCondition.from.config.rightValue.value==null)"
                          v-model="selectCondition.from.config.symbol">
                  <a-select-option v-for="op in selectCondition.operators" :value="op.name"
                                   :key="op.name">
                    {{ op.explanation }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="15"></a-col>
          </a-row>

          <a-row>
            <a-col :span="3">
              右值
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="config.rightValue.type"
                                 style="margin-bottom: 10px;"
                                 :rules="{
                                        required: true,
                                        message: '请选择右值类型',
                                        trigger: ['change', 'blur'],
                                      }">
                <a-select
                    :disabled="(selectCondition.from.config.leftValue.value==null&&selectCondition.from.config.leftValue.type!==2&&selectCondition.from.config.rightValue.value==null)"
                    :value="valueType(selectCondition.from.config.rightValue)"
                    placeholder="请选择"
                    @change="rightValueTypeChange"
                >
                  <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null"
                                   value="PARAMETER">参数
                  </a-select-option>
                  <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null"
                                   value="VARIABLE">变量
                  </a-select-option>
                  <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null"
                                   value="FORMULA">表达式
                  </a-select-option>
                  <a-select-option v-if="isRightTypeSelectView('BOOLEAN')" value="BOOLEAN">布尔
                  </a-select-option>
                  <a-select-option v-if="isRightTypeSelectView('COLLECTION')" value="COLLECTION">集合
                  </a-select-option>
                  <a-select-option v-if="isRightTypeSelectView('STRING')" value="STRING">字符串
                  </a-select-option>
                  <a-select-option v-if="isRightTypeSelectView('NUMBER')" value="NUMBER">数值
                  </a-select-option>
                  <a-select-option v-if="isRightTypeSelectView('DATE')" value="DATE">日期
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="1"/>
            <a-col :span="14">
              <a-form-model-item prop="config.rightValue.value"
                                 style="margin-bottom: 10px;"
                                 :rules="{
                                        required: true,
                                        message: '请输入右值',
                                        trigger: ['change', 'blur'],
                                      }">
                <a-select
                    :disabled="selectCondition.from.config.rightValue.type==null"
                    v-if="selectCondition.from.config.rightValue.type===0||selectCondition.from.config.rightValue.type===1||selectCondition.from.config.rightValue.type===4"
                    show-search
                    :value="selectCondition.from.config.rightValue.valueName"
                    placeholder="请输入关键字进行搜索"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    @search="conditionRightSearch"
                    @change="conditionRightChange"
                >
                  <a-select-option v-for="d in selectConditionRightSearchSelect.data"
                                   :value="d.id"
                                   :key="d.id"
                                   @click.native="conditionRightSearchOptionClick(d)">
                    {{ d.name }}
                  </a-select-option>
                </a-select>
                <a-select
                    :disabled="selectCondition.from.config.rightValue.type==null"
                    v-else-if="selectCondition.from.config.rightValue.valueType==='BOOLEAN'"
                    v-model="selectCondition.from.config.rightValue.value" placeholder="请选择数据 ">
                  <a-select-option value="true">true</a-select-option>
                  <a-select-option value="false">false</a-select-option>
                </a-select>
                <a-input-number v-else-if="selectCondition.from.config.rightValue.valueType==='NUMBER'"
                                :disabled="selectCondition.from.config.rightValue.type==null"
                                v-model="selectCondition.from.config.rightValue.value"
                                style="width: 100%"/>
                <a-date-picker v-else-if="selectCondition.from.config.rightValue.valueType==='DATE'"
                               :disabled="selectCondition.from.config.rightValue.type==null"
                               show-time
                               v-model="selectCondition.from.config.rightValue.value"
                               @change="(date,dateString)=>(datePickerChange(selectCondition.from.config.rightValue,date,dateString))"
                               style="width: 100%"></a-date-picker>
                <a-input v-else v-model="selectCondition.from.config.rightValue.value"
                         :disabled="selectCondition.from.config.rightValue.type==null"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="description" style="margin-bottom: 8px;">
          <a-textarea v-model="selectCondition.from.description" :rows="3"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>


    <footer-tool-bar>
      <a-button type="primary" @click="nextStep()" :loading="footer.nextStepLoading">预览发布</a-button>
    </footer-tool-bar>

    <a-drawer
        placement="left"
        :closable="false"
        width="430px"
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
          <Formula :data-id="parseInt(generalRule.id)" :data-type="dataType"></Formula>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
</template>

<script>
import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";
import  Formula from "@/pages/rulemanagement/builtIncomponents/Formula";
import  InputParameter from "@/pages/rulemanagement/builtIncomponents/InputParameter";
import  Variable from "@/pages/rulemanagement/builtIncomponents/Variable";
import Contextmenu from '@/components/menu/Contextmenu'
// api
import {saveOrUpdate, deleteConditionGroup} from '@/services/conditionGroup'
import {
  getRuleConfig,
  generationRelease,
  saveDefaultAction,
  defaultActionSwitch
} from '@/services/generalRule'
import {saveConditionAndBindGroup, deleteCondition} from '@/services/conditionGroupCondition'
import {updateCondition} from '@/services/condition'
import {saveAction} from '@/services/rule'

//import {listInputParameter} from '@/services/inputParameter'
import {selectSearch} from '@/utils/selectSearch'
import {getSymbolByValueType, getSymbolExplanation} from '@/utils/symbol'
import moment from 'moment';
import {setDefaultValue} from "@/utils/json";
import {mapState} from "vuex";
// import ConditionItem from './ConditionItem'
import TaskGroup from '@/components/task/TaskGroup'
// import TaskItem from '@/components/task/TaskItem'
import {getTypeName, valueType} from '@/utils/value-type'

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar, InputParameter, Variable, Contextmenu, Formula, TaskGroup},
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
          valueName: undefined,
          valueType: undefined,
          variableValue: undefined,
          type: undefined,
        },
        defaultAction: {
          enableDefaultAction: 1,
          value: undefined,
          valueName: undefined,
          valueType: undefined,
          variableValue: undefined,
          type: undefined,
        },
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
      selectCondition: {
        visible: false,
        currentConditionGroup: null,
        confirmLoading: false,
        operators: this.getSymbolByValueType('STRING'),
        from: {
          id: null,
          name: null,
          description: null,
          config: {
            leftValue: {
              type: undefined,
              valueType: undefined,
              value: undefined,
              valueName: undefined,
              variableValue: undefined,
            },
            symbol: undefined,
            rightValue: {
              type: undefined,
              valueType: undefined,
              value: undefined,
              valueName: undefined,
              variableValue: undefined,
            }
          }
        }
      },
    }
  },
  mounted() {
    this.generalRule.id = this.id
    this.getRuleConfig();
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
    defaultActionValueTypeChange(valueType) {
      this.generalRule.defaultAction = {
        enableDefaultAction: this.generalRule.defaultAction.enableDefaultAction,
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.generalRule.defaultAction.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.generalRule.defaultAction.type = 1;
      } else if (valueType === 'FORMULA') {
        this.generalRule.defaultAction.type = 4;
      } else {
        this.generalRule.defaultAction.valueType = valueType;
        this.generalRule.defaultAction.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
    },
    enableDefaultActionChange() {
      let defaultAction = this.generalRule.defaultAction;
      if (defaultAction.enableDefaultAction === 0) {
        defaultAction.enableDefaultAction = 1;
      } else {
        // 如果开启默认规则，判断是否填写，如果没有填写，手动触发提示错误
        if (defaultAction.type == null) {
          this.$refs['generalRuleForm'].fields[2].validateMessage = '请选择默认结果类型'
          this.$refs['generalRuleForm'].fields[2].validateState = 'error'
          return;
        }
        if (defaultAction.value == null) {
          this.$refs['generalRuleForm'].fields[3].validateMessage = '请输入默认结果值'
          this.$refs['generalRuleForm'].fields[3].validateState = 'error'
          return;
        }
        defaultAction.enableDefaultAction = 0;
      }
      defaultActionSwitch({
        generalRuleId: this.generalRule.id,
        enableDefaultAction: defaultAction.enableDefaultAction
      }).then(res => {
        if (res.data.data) {
          this.$message.success(defaultAction.enableDefaultAction === 0 ? '默认结果已开启' : '默认结果已关闭');
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
      switch (key) {
        case '1':
          this.showDrawer(pageKey);
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
    saveAction() {
      if (this.generalRule.action.type == null) {
        return;
      }
      if (!this.generalRule.action.value) {
        return;
      }
      if (!this.generalRule.action.valueType) {
        return;
      }
      saveAction({
        ruleId: this.generalRule.ruleId,
        configValue: this.generalRule.action
      }).then(res => {
        if (res.data.data) {
          this.$message.success("结果保存成功");
        }
      })
    },
    saveDefaultAction() {
      if (this.generalRule.defaultAction.type == null) {
        return;
      }
      if (!this.generalRule.defaultAction.value) {
        return;
      }
      if (!this.generalRule.defaultAction.valueType) {
        return;
      }
      saveDefaultAction({
        generalRuleId: this.generalRule.id,
        configValue: this.generalRule.defaultAction
      }).then(res => {
        if (res.data.data) {
          this.$message.success("默认结果保存成功");
        }
      })
    },
    actionValueDatePickerOpenChange(s) {
      if (!s) {
        this.saveAction();
      }
    },
    defaultActionValueDatePickerOpenChange(s) {
      if (!s) {
        this.saveDefaultAction();
      }
    },
    actionSearch(value) {
      selectSearch({
            name: value,
            dataId: this.generalRule.id,
            dataType: this.dataType,
            valueType: null // 查询所有类型
          }, data => (this.actionSearchSelect.data = data)
          , this.generalRule.action.type)
    },
    defaultActionSearch(value) {
      selectSearch({
            name: value,
            dataId: this.generalRule.id,
            dataType: this.dataType,
            valueType: [this.generalRule.action.valueType]
          }, data => (this.actionSearchSelect.data = data)
          , this.generalRule.defaultAction.type)
    },
    actionSearchOptionClick(d) {
      let action = this.generalRule.action;
      action.value = d.id;
      action.valueType = d.valueType;
      action.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (action.type === 1 && d.type === 2) {
        action.variableValue = d.value;
      }
      this.saveAction();
    },
    defaultActionSearchOptionClick(d) {
      let defaultAction = this.generalRule.defaultAction;
      defaultAction.value = d.id;
      defaultAction.valueType = d.valueType;
      defaultAction.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (defaultAction.type === 1 && d.type === 2) {
        defaultAction.variableValue = d.value;
      }
      this.saveDefaultAction();
    },
    editCondition(cg, cgc) {
      // 当前条件组
      this.selectCondition.currentConditionGroup = cg;
      this.selectCondition.from = cgc.condition;
      // 加载运算符
      this.selectCondition.operators = this.getSymbolByValueType(cgc.condition.config.leftValue.valueType)
      this.selectCondition.visible = true;
    },
    deleteCondition(cgc, conditionGroupRefId, conditionId) {
      deleteCondition({
        conditionId: conditionId,
        conditionGroupRefId: conditionGroupRefId
      }).then(res => {
        if (res.data.data) {
          // 删除掉前端数组中的数据
          // cg.conditionGroupCondition
          cgc.forEach((value, index) => {
            if (value.condition.id === conditionId) {
              cgc.splice(index, 1);
            }
          });
          this.$message.success("删除条件成功");
        }
      })
    },
    conditionLeftSearch(value) {
      selectSearch({
            name: value,
            dataId: this.generalRule.id,
            dataType: this.dataType,
            valueType: null // 查询所有类型
          }, data => (this.selectConditionLeftSearchSelect.data = data)
          , this.selectCondition.from.config.leftValue.type)
    },
    conditionLeftChange(value) {
      this.selectConditionLeftSearchSelect.value = value;
    },
    conditionLeftSearchOptionClick(d) {
      let leftValue = this.selectCondition.from.config.leftValue;
      leftValue.value = d.id;
      leftValue.valueType = d.valueType;
      leftValue.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if ((leftValue.type === 1 && d.type === 2) || leftValue.type === 4) {
        leftValue.variableValue = d.value;
      }
      // 判断查询的变量或者元素 类型是否与右值相同，不相同则清空右值的
      if (d.valueType !== this.selectCondition.from.config.rightValue.valueType) {
        this.selectCondition.from.config.rightValue = setDefaultValue(this.selectCondition.from.config.rightValue)
        // 并重置运算符，否则不重置
        this.selectCondition.operators = this.getSymbolByValueType(d.valueType)
        // 删除运算符
        this.selectCondition.from.config.symbol = undefined;
      }
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
    actionValueTypeChange(valueType) {
      this.generalRule.action = {
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.generalRule.action.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.generalRule.action.type = 1;
      } else if (valueType === 'FORMULA') {
        this.generalRule.action.type = 4;
      } else {
        this.generalRule.action.valueType = valueType;
        this.generalRule.action.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
    },
    /**
     * 条件左值类型修改
     */
    leftValueTypeChange(valueType) {
      this.selectCondition.from.config.leftValue = {
        value: undefined,
        valueName: undefined,
        variableValue: undefined,
        valueType: undefined,
      }
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.leftValue.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.leftValue.type = 1;
      } else if (valueType === 'FORMULA') {
        this.selectCondition.from.config.leftValue.type = 4;
      } else {
        this.selectCondition.from.config.leftValue.type = 2;
        this.selectCondition.from.config.leftValue.valueType = valueType;
        // 固定值场景清空右值，如果变量或者参数，等搜索到选中时再去判断清空
        // 左面发生改变，右边也改变  如果值类型相同，则不需要更改
        if (valueType !== this.selectCondition.from.config.rightValue.valueType) {
          this.selectCondition.from.config.rightValue = setDefaultValue(this.selectCondition.from.config.rightValue);
          // 删除运算符
          this.selectCondition.from.config.symbol = undefined;
          this.selectCondition.operators = []
        }
        // 根据左值更改运算符
        this.selectCondition.operators = this.getSymbolByValueType(valueType)
      }
      // 清空远程搜索缓存
      this.selectConditionLeftSearchSelect.data = [];
      this.selectConditionLeftSearchSelect.value = undefined
    },
    conditionRightSearch(value) {
      selectSearch({
        name: value,
        dataId: this.generalRule.id,
        dataType: this.dataType,
        // 查询指定类型右值
        valueType: this.getRValueType(this.selectCondition.from.config.leftValue.valueType, this.selectCondition.from.config.symbol)
      }, data => (this.selectConditionRightSearchSelect.data = data), this.selectCondition.from.config.rightValue.type, null);
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
      this.selectConditionRightSearchSelect.value = value;
    },
    conditionRightSearchOptionClick(d) {
      let rightValue = this.selectCondition.from.config.rightValue;
      rightValue = d.id;
      rightValue = d.valueType;
      rightValue = d.name;
      // 变量  d.type 如果是固定值
      if ((rightValue.type === 1 && d.type === 2) || rightValue.type === 4) {
        rightValue.variableValue = d.value;
      }
    },
    rightValueTypeChange(valueType) {
      this.selectCondition.from.config.rightValue = {
        value: undefined,
        valueName: undefined,
        variableValue: undefined,
        valueType: undefined,
      }
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.rightValue.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.rightValue.type = 1;
        // 变量的类型
      } else if (valueType === 'FORMULA') {
        this.selectCondition.from.config.rightValue.type = 4;
      } else {
        this.selectCondition.from.config.rightValue.type = 2;
        this.selectCondition.from.config.rightValue.valueType = valueType;
      }
      // 清空远程搜索缓存
      this.selectConditionRightSearchSelect.data = [];
      this.selectConditionRightSearchSelect.value = undefined
    },
    getTypeName(type) {
      return getTypeName(type);
    },
    isRightTypeSelectView(valueType) {
      // 保留一个与目前右边值类型相等的
      if (this.selectCondition.from.config.rightValue.valueType === valueType) {
        return true;
      }
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
    nextStep() {
      this.$refs['generalRuleForm'].validate(valid => {
        if (valid) {
          this.footer.nextStepLoading = true;
          generationRelease(this.generalRule).then(res => {
            if (res.data.data) {
              this.footer.nextStepLoading = false;
              this.$emit("choicePage", {pageIndex: 3, id: this.generalRule.id})
            }
          })
        } else {
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
    addCondition(cg) {
      this.selectCondition.currentConditionGroup = cg;
      // 还原配置
      this.selectCondition.from = setDefaultValue(this.selectCondition.from);
      this.selectCondition.visible = true;
    },
    addConditionCancel() {
      this.selectCondition.visible = false;
    },
    addConditionOk(formName) {
      this.selectCondition.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 更新条件
          if (this.selectCondition.from.id !== undefined) {
            updateCondition(this.selectCondition.from).then(res => {
              if (res.data.data) {
                // 刷新页面条件数据
                this.selectCondition.currentConditionGroup.conditionGroupCondition.forEach(f => {
                  if (f.condition.id === this.selectCondition.from.id) {
                    f.condition = this.selectCondition.from;
                  }
                })
                this.$message.success("条件更新成功");
                this.selectCondition.confirmLoading = false;
                this.selectCondition.visible = false;
              }
            })
            return;
          }
          // 获取最后一条的orderNo
          let orderNo = 0;
          let conditionGroupCondition = this.selectCondition.currentConditionGroup.conditionGroupCondition;
          if (conditionGroupCondition.length > 0) {
            orderNo = conditionGroupCondition[conditionGroupCondition.length - 1].orderNo + 1;
          }
          // 插入一条记录
          saveConditionAndBindGroup({
            generalRuleId: this.generalRule.id,
            // 传入条件组信息，条件信息 绑定关系
            conditionGroupId: this.selectCondition.currentConditionGroup.id,
            orderNo: orderNo,
            addConditionRequest: this.selectCondition.from
          }).then(res => {
            if (res.data.data) {
              // 当前条件组内插入一条数据
              this.selectCondition.from.id = res.data.data.conditionId;
              this.selectCondition.currentConditionGroup.conditionGroupCondition.push({
                "id": res.data.data.conditionGroupConditionId,
                "orderNo": orderNo,
                "condition": this.selectCondition.from
              });
              this.$message.success("添加成功");
              this.selectCondition.confirmLoading = false;
              this.selectCondition.visible = false;
            }
          })
        } else {
          this.selectCondition.confirmLoading = false;
          return false;
        }
      });
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
        if (res.data.data) {
          newConditionGroup.id = res.data.data;
          this.generalRule.conditionGroup.push(newConditionGroup);
          this.$message.success("添加条件组成功");
        }
      });
    },
    updateConditionGroupName(cg) {
      saveOrUpdate({
        id: cg.id,
        ruleId: this.generalRule.ruleId,
        name: cg.name
      });
    },
    deleteConditionGroup(cg) {
      // 删除条件组
      deleteConditionGroup({id: cg.id}).then(res => {
        if (res.data.data) {
          this.generalRule.conditionGroup.forEach((value, index) => {
            if (value.id === cg.id) {
              this.generalRule.conditionGroup.splice(index, 1);
            }
          });
          this.$message.success("删除条件组成功");
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
