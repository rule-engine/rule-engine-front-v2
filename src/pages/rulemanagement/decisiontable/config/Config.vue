<template>
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
          resizable
          border
          row-key
          ref="xTable"
          class="sortable-row-demo"
          style="width: 100%;"
          height="600"
          :scroll-y="{enabled: false}"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          :data="tableData">
        <vxe-table-column
            v-for="(config) in tableColumn"
            :key="config.key"
            :type="config.type"
            :field="config.field"
            :title="config.title"
            :fixed="config.fixed"
            :width="config.width"
            class-name="drag-btn"
            :edit-render="{name: 'input', attrs: {type: 'text'}}"
            :filters="config.filters">
          <!--          <template v-slot:edit="{ row }">-->
          <!--            <a-row>-->
          <!--              <a-col :span="6">-->
          <!--                <vxe-select v-model="row.type" placeholder="请选择">-->
          <!--                  <vxe-option value="1">字符串</vxe-option>-->
          <!--                  <vxe-option value="2">集合</vxe-option>-->
          <!--                </vxe-select>-->
          <!--              </a-col>-->
          <!--              <a-col :span="18">-->
          <!--                <vxe-input type="text" v-model="row.name" @blur="editAge(row)"></vxe-input>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </template>-->
        </vxe-table-column>
      </vxe-table>

    </a-card>
  </page-layout>
</template>

<script>
import Sortable from 'sortablejs'
import PageLayout from "@/layouts/PageLayout";

export default {
  name: "Config",
  components: {PageLayout},
  data() {
    return {
      tableColumn: [
        {key: 1, type: 'seq', width: 60, title: '序号', fixed: null},
        // {key: 2, type: 'checkbox', width: 50, fixed: null},
        {key: 3, field: 'name', title: '条件1'},
        {key: 4, field: 'nickname', title: '条件2',},
        {key: 5, field: 'sex', title: '条件3', filters: [{value: '1', label: '男'}, {value: '0', label: '女'}]},
        {key: 6, field: 'role', title: '结果',},
      ],
      tableData: [
        {id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'vxe-table 从入门到放弃'},
        {id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou'},
        {id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai'},
        {id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'vxe-table 从入门到放弃'},
        {id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai'},
        {id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: '0', age: 21, address: 'vxe-table 从入门到放弃'},
        {id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: '1', age: 29, address: 'vxe-table 从入门到放弃'},
        {id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: '1', age: 35, address: 'vxe-table 从入门到放弃'}
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
