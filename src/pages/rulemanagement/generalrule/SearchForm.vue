<template>
  <a-card :bordered="false" class="search-form">
    <a-form :form="form">
      <form-row label="所属类目">
        <a-form-item>
          <tag-select>
            <tag-select-option>类目一</tag-select-option>
            <tag-select-option>类目二</tag-select-option>
            <tag-select-option>类目三</tag-select-option>
          </tag-select>
        </a-form-item>
      </form-row>

      <form-row label="owner" style="padding-bottom: 11px">
        <a-form-item>
          <a-select
            mode="multiple" style="max-width: 286px"
            v-decorator="['owner', {initialValue: ['1', '2']}]"
          >
            <a-select-option value="3">我自己</a-select-option>
            <a-select-option value="1">吴家豪</a-select-option>
            <a-select-option value="2">周星星</a-select-option>
            <a-select-option value="4">李宁</a-select-option>
          </a-select>
        </a-form-item>
        <a @click="lookMyself">只看自己的</a>
      </form-row>
      <form-row label="其他选项">
        <a-row>
          <a-col :span="8">
            <a-form-item label="规则状态" :labelCol="{span: 6}" :wrapperCol="{span: 12}">
              <a-select placeholder="不限">
                <a-select-option value="1">周星星</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
                label="好评度"
                :labelCol="{span: 6}"
                :wrapperCol="{span: 12}"
            >
              <a-select placeholder="不限">
                <a-select-option value="1">优秀</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </form-row>

      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button >批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </a-space>
    </a-form>
  </a-card>
</template>

<script>
import TagSelect from '../../../components/tool/TagSelect'
import FormRow from '../../../components/form/FormRow'

const TagSelectOption = TagSelect.Option

export default {
  name: 'SearchForm',
  components: {FormRow, TagSelectOption, TagSelect},
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    lookMyself () {
      this.form.setFieldsValue({
        owner: '3'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search-form{
    margin-bottom: 24px;
  }
</style>
