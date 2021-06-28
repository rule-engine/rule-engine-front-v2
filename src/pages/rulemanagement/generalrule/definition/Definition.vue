<template>
  <page-layout>
    <a-card :bordered="false">
      <a-steps :current="0">
        <a-step>
          <!-- <span slot="title">Finished</span> -->
          <template slot="title">
            规则定义
          </template>
          <span slot="description">This is a description.</span>
        </a-step>
        <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description."/>
        <a-step title="Waiting" description="This is a description."/>
      </a-steps>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";

export default {
  name: "Definition",
  components: [PageLayout],
  data:{
    return {

    }
  }
}
</script>

<style scoped>

</style>
