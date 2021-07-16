<template>
    <a-card class="result-error" :bordered="false">
      <result style="margin-bottom: 16px; margin-top: 48px" :is-success="false" :title="title" :description="description">
        <template slot="action">
          <a-button type="primary" @click="$router.go(-1)" >返回修改</a-button>
        </template>
        <div>
          <div style="fontSize: 16px; fontWeight: 500; marginBottom: 16px">
            您访问的规则不存在：
          </div>
          <div style="margin-bottom: 16px">
            <a-icon class="error-icon" type="close-circle-o"/>
            该规则可能已经被删除
            <a style="margin-left: 16px">返回规则列表 <a-icon type="right" /></a>
          </div>
          <div>
            <a-icon class="error-icon" type="close-circle-o"/>
            该规则可能已经被删除
            <a style="margin-left: 16px">去主页 <a-icon type="right" /></a>
          </div>
        </div>
      </result>
    </a-card>
</template>

<script>
import Result from '@/components/result/Result'
export default {
  name: 'Error',
  components: {Result},
  data () {
    return {
      title: '提交失败',
      description: '请核对并修改以下信息后，再重新提交。'
    }
  }
}
</script>

<style scoped lang="less">
.result-error{
  .error-icon{
    color: @red-6;
    margin-right: 8px
  }
}
</style>
