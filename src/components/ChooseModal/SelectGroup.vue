<template>
  <div>
    <choose-modal type="group" :listData="listData" :value="value" @change="onChange" />
  </div>
</template>
<script>
import ChooseModal from './components/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    }
  },
  components: {
    ChooseModal
  }
}
</script>
