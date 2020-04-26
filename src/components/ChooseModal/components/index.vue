<template>
  <div>
    <a-input
      style="cursor: pointer;"
      placeholder="Basic usage"
      v-model="userNameLabel"
      readOnly
      @click="showUserModal">
      <a-icon slot="prefix" :type="type === 'user' ? 'user' : 'team'" />
    </a-input>
    <a-modal
      :title="title"
      :visible="visible"
      width="630px"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button key="back" type="dashed" @click="handleCancel">关闭</a-button>
        <a-button key="clear" @click="clearHandle">清空</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确定
        </a-button>
      </template>
      <show-modal ref="userModal" :type="type" :listData="listData" :value="value" @change="change"/>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
// 穿梭框控件
import ShowModal from './ShowModal'

export default {
  name: 'ChooseModal',
  props: {
    type: {
      type: String,
      default: 'user'
    },
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
  data () {
    return {
      title: '',
      // 弹窗
      visible: false,
      confirmLoading: false,
      loading: false,
      selectEmps: []
    }
  },
  created () {
    this.title = this.type === 'user' ? '选择人员' : '选择组群'
  },
  computed: {
    userNameLabel () {
      const arr = []
      this.listData.forEach(item => {
        if (this.value.includes(item.value)) {
          arr.push(item.label)
        }
      })
      return arr.join(',')
    }
  },
  methods: {
    showUserModal () {
      this.visible = true
    },
    handleOk () {
      this.visible = false
      const value = this.selectEmps.slice(0)
      this.$emit('change', value)
    },
    handleCancel () {
      this.visible = false
    },
    clearHandle () {
      this.visible = false
      this.$refs.userModal.clearSelectUserLists()
    },
    change (selectEmps) {
      this.selectEmps = selectEmps
    }
  },
  components: {
    ShowModal
  }
}
</script>

<style lang="less" scoped>
</style>
