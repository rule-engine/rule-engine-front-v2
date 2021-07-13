<template>
  <div>
    <page-layout>
      <a-card title="规则定义" :bordered="false">
        <!--        <a-steps :current="0">-->
        <!--          <a-step>-->
        <!--            &lt;!&ndash; <span slot="title">Finished</span> &ndash;&gt;-->
        <!--            <template slot="title">-->
        <!--              规则定义-->
        <!--            </template>-->
        <!--            <span slot="description">This is a description.</span>-->
        <!--          </a-step>-->
        <!--          <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description."/>-->
        <!--          <a-step title="Waiting" description="This is a description."/>-->
        <!--        </a-steps>-->

        <a-form-model ref="generalRule" :rules="rules" :model="generalRule" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="generalRule.name" placeholder="请输入规则名称">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="编码" prop="code">
            <a-input :disabled="!isNaN(generalRule.id)" v-model="generalRule.code" type="code"
                     placeholder="请输入规则编码">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="说明" prop="description">
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

import {addGeneralRule, updateGeneralRule, getRuleDefinition} from '@/services/generalRule'

export default {
  name: "Definition",
  components: {PageLayout, FooterToolBar},
  props: {
    ruleId: {
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
        code: {min: 1, trigger: ['change', 'blur'], message: "请输入规则编码", required: true},
      }
    }
  },
  mounted() {
    this.generalRule.id = this.ruleId
    this.getRuleDefinition();
  },
  methods: {
    getRuleDefinition() {
      if (this.generalRule.id) {
        getRuleDefinition({id: this.generalRule.id}).then(res => {
          this.generalRule = res.data.data;
          // 刚进页面 查询到规则name
          let nameElement = document.getElementsByClassName('ant-tabs-tab-active')[0].getElementsByClassName('title')[0];
          nameElement.innerHTML = '规则(' + this.generalRule.name + ')';
        })
      } else {
        let nameElement = document.getElementsByClassName('ant-tabs-tab-active')[0].getElementsByClassName('title')[0];
        nameElement.innerHTML = '新建规则';
      }
    },
    //保存规则定义
    saveRuleDefinition() {
      this.loading = true;
      if (!isNaN(this.generalRule.id)) {
        updateGeneralRule(this.generalRule).then(res => {
          if (res.data.code === 200) {
            this.$emit("choicePage", {pageIndex: 2, id: this.generalRule.id})
          }
        })
      } else {
        addGeneralRule(this.generalRule).then(res => {
          if (res.data.code === 200) {
            this.$emit("choicePage", {pageIndex: 2, id: res.data.data})
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
