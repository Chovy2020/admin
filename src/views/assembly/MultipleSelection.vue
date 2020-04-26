<template>
  <div>
    <multiple-selection :listData="multipleData" v-model="multipleList"/>
  </div>
</template>
<script>
import MultipleSelection from '@/components/MultipleSelection'
export default {
  data () {
    return {
      // 选中(默认)值的value值
      multipleList: ['a', 'b'],
      // 组件数据结构 {key: 真实值, title: 显示值}
      multipleData: [{ key: 'a', title: 'A' }, { key: 'b', title: 'B' }, { key: 'c', title: 'C' }]
    }
  },
  components: {
    MultipleSelection
  }
}
</script>
