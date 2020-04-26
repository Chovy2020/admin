<template>
  <div class="dynamic-table">
    <a-table :columns="columnsTitle" :dataSource="tableData" bordered :pagination="false">
      <template slot="key" slot-scope="text, record, index">
        {{ index+1 }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(index)"
        >
          <a-icon type="delete" />
        </a-popconfirm>
      </template>
    </a-table>
    <a-button type="primary" icon="plus" @click="handleAdd"></a-button>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'DynamicTable',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      columnsTitle: [],
      requiredArr: [],
      titleArr: {},
      tableData: []
    }
  },
  created () {
    this.tableData = _.cloneDeep(this.value)
    // 处理表头
    const columnsTitle = [{
      title: 'No',
      dataIndex: '__key',
      width: '50px',
      scopedSlots: { customRender: 'key' }
    }]
    this.columns.forEach(item => {
      const col = _.cloneDeep(item)
      if (col.widget) {
        const { name, option } = col.widget
        col.customRender = (text, record, index) => {
          if (name === 'a-switch') {
            option.checked = text
          } else {
            option.value = text
          }
          return <name {...{ props: option }} onChange={e => this.changeCell(e, col.dataIndex, index, name)} />
        }
      }
      if (col.required) {
        const obj = Object.assign({}, col, { title: <slot>{col.title}<span class="require">*</span></slot> })
        columnsTitle.push(obj)
        this.requiredArr.push(col.dataIndex)
      } else {
        columnsTitle.push(col)
      }

      // 点击Add新增的字段名
      this.$set(this.titleArr, col.dataIndex, col.default === undefined ? '' : col.default)
    })
    // 添加操作栏
    columnsTitle.push({
      title: 'Oper',
      align: 'center',
      width: '50px',
      scopedSlots: { customRender: 'operation' }
    })
    this.columnsTitle = columnsTitle
  },
  computed: {
  },
  methods: {
    changeCell (value, key, rowIndex, name) {
      if (name === 'a-input') {
        value = value.target.value
      }
      this.tableData[rowIndex] = Object.assign(this.tableData[rowIndex], { [key]: value })
    },
    handleAdd () {
      this.tableData.push(_.cloneDeep(this.titleArr))
    },
    onDelete (index) {
      const data = _.cloneDeep(this.tableData)
      const arr = []
      data.splice(index, 1)
      data.forEach((item, index) => {
        arr.push(_.cloneDeep(item))
      })
      this.tableData = arr
    },
    saveAdd () {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        for (const key in item) {
          if (this.requiredArr.includes(key)) {
            if (item[key] === '') {
              this.$message.error('请填写完整动态表格!')
              return
            }
          }
        }
      }
      this.$emit('change', this.tableData)
    }
  }
}
</script>

<style lang="less" scoped>
  .dynamic-table {
    &>button {
      margin: 10px 0;
    }
    .anticon-delete {
      cursor: pointer;
    }
    .require {
      color: #f00;
    }
    .ant-select  {
      width: 100%;
    }
  }
</style>
