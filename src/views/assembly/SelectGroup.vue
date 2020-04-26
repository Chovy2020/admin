<template>
  <div>
    <select-group :listData="userListData" v-model="groupList"/>
  </div>
</template>
<script>
import SelectGroup from '@/components/ChooseModal/SelectGroup'
export default {
  data () {
    return {
      // 选中(默认)群组的value值
      groupList: [],
      // 组件所有群组的数据结构 {value: 真实值, label: 显示值, type: 名称的首字母}
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
    SelectGroup
  }
}
</script>
