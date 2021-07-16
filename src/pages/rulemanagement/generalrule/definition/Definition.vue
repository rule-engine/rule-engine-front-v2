<template>
  <div>
    <page-layout>
      <a-card title="规则定义" :bordered="false">
        <a-form-model ref="generalRuleForm" :rules="rules" :model="generalRule" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="名称" has-feedback prop="name">
            <a-input v-model="generalRule.name" placeholder="请输入规则名称">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="编码" has-feedback prop="code">
            <a-input :disabled="!isNaN(generalRule.id)" v-model="generalRule.code" type="code"
                     placeholder="请输入规则编码">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="说明" has-feedback prop="description">
            <a-input v-model="generalRule.description" type="textarea" placeholder="请输入规则说明"/>
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </page-layout>

    <!--    谁来修复footer-tool-bar闪现问题-->
    <footer-tool-bar>
      <a-button type="primary" @click="saveRuleDefinition()" :loading="footer.loading">下一步</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";

import {addGeneralRule, updateGeneralRule, getRuleDefinition, verifyRuleCode} from '@/services/generalRule'

export default {
  name: "Definition",
  components: {PageLayout, FooterToolBar},
  props: {
    id: {
      type: Number,
      required: false
    }
  },
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
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入规则名称",},
        code: {trigger: ['blur'], asyncValidator: this.ruleCodeValidator, required: true},
      }
    }
  },
  mounted() {
    this.generalRule.id = this.id
    this.getRuleDefinition();
  },
  methods: {
    ruleCodeValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入规则编码'));
      } else {
        // 如果是编辑，不校验是否存在这个规则code 放行  接口有最终校验
        if (this.generalRule.id != null && !isNaN(this.generalRule.id)) {
          callback()
          return;
        }
        verifyRuleCode({param: value}).then(resp => {
          if (resp.data.code === 200) {
            if (!resp.data.data) {
              callback()
            } else {
              callback(new Error('该规则编码已经存在！'));
            }
          } else {
            callback(new Error(resp.data.message));
          }
        })
      }

    },
    getRuleDefinition() {
      if (this.generalRule.id && !isNaN(this.generalRule.id)) {
        getRuleDefinition({id: this.generalRule.id}).then(res => {
          this.generalRule = res.data.data;
        })
      }
    },
    //保存规则定义
    saveRuleDefinition() {
      this.footer.loading = true;
      this.$refs['generalRuleForm'].validate(valid => {
        if (valid) {
          if (!isNaN(this.generalRule.id)) {
            updateGeneralRule(this.generalRule).then(res => {
              if (res.data.code === 200) {
                this.$emit("choicePage", {pageIndex: 2, id: this.generalRule.id})
              }
              this.footer.loading = false;
            })
          } else {
            addGeneralRule(this.generalRule).then(res => {
              if (res.data.code === 200) {
                //this.$emit("choicePage", {pageIndex: 2, id: res.data.data})
                this.$closePage("/generalRuleRouter/new")
                this.$openPage({
                  path: '/generalRuleRouter/' + res.data.data,
                  query: {pageIndex: 2}
                }, `规则(${this.generalRule.name})`);
              }
              this.footer.loading = false;
            })
          }
        } else {
          this.footer.loading = false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
