<template>
  <div>
    <select-employee :listData="userListData" v-model="userList"/>
  </div>
</template>
<script>
import SelectEmployee from '@/components/ChooseModal/SelectEmployee'
export default {
  data () {
    return {
      // 选中(默认)人员的value值
      userList: ['1'],
      // 组件所有人员的数据结构 {value: 真实值, label: 显示值, type: 名称的首字母}
      userListData: [
        { value: '1', label: 'typeA1', type: 'A' },
        { value: '2', label: 'typeA2', type: 'A' },
        { value: '3', label: 'typeB1', type: 'B' },
        { value: '4', label: 'typeB2', type: 'B' },
        { value: '5', label: 'typeB3', type: 'B' }
      ]
    }
  },
  components: {
    SelectEmployee
  }
}
</script>
