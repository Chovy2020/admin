<template>
  <div>
    <dynamic-table ref="dynamicTable" :columns="columns" v-model="dynamicTableData"/>
    <a-button @click="submit">提交</a-button>
  </div>
</template>
<script>
import DynamicTable from '@/components/DynamicTable'
export default {
  data () {
    return {
      // 表头数据
      // {
      //   title:显示值,
      //   dataIndex: 真实值,
      //   widget: 显示类型(目前支持文本框/开关/下拉框), (可不传, 不传则显示普通文本),
      //   default: 新增时的默认值(可不传)
      //   required: 是否必填(可不传)
      // }
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          widget: { name: 'a-input', option: { placeholder: '请填写' } },
          default: 'abc',
          required: true
        },
        {
          title: 'Money',
          className: 'column-money',
          dataIndex: 'money',
          widget: { name: 'a-switch', option: {} }
        },
        {
          title: 'Address',
          dataIndex: 'address',
          widget: { name: 'a-select', option: { placeholder: '请选择', options: [{ label: '选择1', value: '1' }, { label: '选择2', value: '2' }] } }
        }
      ],
      // 表格数据结构
      dynamicTableData: [
        {
          name: 'John Brown',
          money: true,
          address: ''
        },
        {
          name: 'Jim Green',
          money: true,
          address: ''
        },
        {
          name: 'Joe Black',
          money: false,
          address: ''
        }
      ]
    }
  },
  components: {
    DynamicTable
  },
  methods: {
    submit () {
      this.$refs.dynamicTable.saveAdd()
    }
  }
}
</script>
