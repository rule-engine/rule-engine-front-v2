<template>
  <div>
    <page-layout>
      <a-card title="决策表配置" :bordered="false">
        <span slot="extra" style="margin-left: 16px;">

        </span>

        <!--      <vxe-toolbar>-->
        <!--        <template #buttons>-->
        <!--          <vxe-button @click="addColumn()">最后增加一列</vxe-button>-->
        <!--          <vxe-button @click="removeColumn()">删除最后一列</vxe-button>-->
        <!--          <vxe-button @click="updateSexFilter()">修改sex列筛选条件</vxe-button>-->
        <!--          <vxe-button @click="toggleFixedColumn(0, 'left')">切换第一列固定</vxe-button>-->
        <!--          <vxe-button @click="toggleFixedColumn(1, 'left')">切换第二列固定</vxe-button>-->
        <!--          <vxe-button @click="updateWidthColumn(2, 500)">修改第三列宽度</vxe-button>-->
        <!--          <vxe-button @click="updateWidthColumn(3, 500)">修改第四列宽度</vxe-button>-->
        <!--        </template>-->
        <!--      </vxe-toolbar>-->

        <vxe-table
            :resizable="false"
            border
            row-key
            ref="xTable"
            class="sortable-row-demo"
            height="600"
            :scroll-y="{enabled: false}"
            :edit-config="{trigger: 'click', mode: 'cell'}"
            :data="tableData">

          <vxe-table-column
              title="优先级"
              field="priority"
              width="80"
              class-name="drag-btn"
              :edit-render="{name: 'input', attrs: {type: 'text'}}">
          </vxe-table-column>

          <vxe-table-column
              v-for="(config,ci) in conditionHeaders"
              :key="ci.orderNo"
              :title="config.name"
              min-width="280"
              :edit-render="{name: 'input', attrs: {type: 'text'}}"
              :filters="config.filters">
            <template v-slot:header="{ column }">
              {{ column.title }}
            </template>
            <template v-slot:default="{ row }">
              {{ row.conditions[ci].value }}
            </template>
            <template v-slot:edit="{ row }">
              <a-row>
                <a-col :span="7">
                  <vxe-select v-model="row.conditions[ci].valueType" placeholder="请选择">
                    <vxe-option value="STRING">字符串</vxe-option>
                    <vxe-option value="COLLECTION">集合</vxe-option>
                  </vxe-select>
                </a-col>
                <a-col :span="17">
                  <vxe-input type="text" v-model="row.conditions[ci].value"></vxe-input>
                </a-col>
              </a-row>
            </template>
          </vxe-table-column>


          <vxe-table-column
              :title="actionHeader.name"
              width="200"
              field="action"
              :edit-render="{name: 'input', attrs: {type: 'text'}}">
          </vxe-table-column>
        </vxe-table>

      </a-card>

    </page-layout>
    <footer-tool-bar>
      <a-button type="primary" @click="nextStep()" :loading="footer.nextStepLoading">预览发布</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import PageLayout from "@/layouts/PageLayout";
import FooterToolBar from '@/components/tool/FooterToolBar'

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar},
  data() {
    return {
      footer: {
        nextStepLoading: false
      },
      conditionHeaders: [
        {name: "条件11", type: 1, valueType: "STRING", operator: "EQ", orderNo: 10},
        {name: "条件12", type: 1, valueType: "STRING", operator: "EQ", orderNo: 11},
        // {key: 4, field: 'nickname', title: '条件2',},
        // {key: 5, field: 'sex', title: '条件3', filters: [{value: '1', label: '男'}, {value: '0', label: '女'}]},
      ],
      actionHeader: {
        name: "结果", type: 1, valueType: "STRING",
      },
      tableData: [
        {
          priority: 10001,
          conditions: [
            {type: 3, valueType: "STRING", value: "1"}, {type: 3, valueType: "STRING", value: "2"},
          ],
          action: '结果1'
        },
        {
          priority: 10002,
          conditions: [
            {type: 3, valueType: "STRING", value: "11"}, {type: 3, valueType: "STRING", value: "22"},
          ],
          action: '结果2'
        },
      ]
    }
  },
  methods: {
    addColumn() {
      const uniqueId = Date.now()
      this.tableColumn.push({
        field: `new_${uniqueId}`,
        title: `新列_${uniqueId}`,
        minWidth: 100
      })
    },
    removeColumn() {
      this.tableColumn.pop()
    },
    updateSexFilter() {
      const xTable = this.$refs.xTable
      const column = xTable.getColumnByField('sex')
      // 修改筛选列表，并默认设置为选中状态
      xTable.setFilter(column, [
        {value: '1', label: '男'},
        {value: '0', label: '女', checked: true}
      ])
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    },
    toggleFixedColumn(index, value) {
      const xTable = this.$refs.xTable
      this.tableColumn[index].fixed = this.tableColumn[index].fixed ? null : value
      // 更改了列属性，需要手动刷新列
      this.$nextTick(() => {
        // 由于固定列的动态切换是无状态的，所以需要手动刷新滚动位置
        xTable.refreshColumn().then(() => xTable.refreshScroll())
      })
    },
    rowDrop() {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable
        this.sortable1 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-btn',
          onEnd: ({newIndex, oldIndex}) => {
            const currRow = this.tableData.splice(oldIndex, 1)[0]
            this.tableData.splice(newIndex, 0, currRow)
          }
        })
      })
    },
    updateWidthColumn(index, value) {
      this.tableColumn[index].width = value
      // 更改了列属性，需要手动刷新列
      this.$nextTick(() => {
        this.$refs.xTable.refreshColumn()
      })
    }
  },
  created() {
    this.rowDrop()
  },
  beforeDestroy() {
    if (this.sortable1) {
      this.sortable1.destroy()
    }
  },
}
</script>
<style>
.vxe-table--render-default .vxe-table--border-line {
  z-index: 9;
}
</style>
<style scoped>
.sortable-row-demo .drag-btn {
  cursor: move;
  font-size: 12px;
}

.sortable-row-demo .vxe-body--row.sortable-ghost,
.sortable-row-demo .vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
</style>
