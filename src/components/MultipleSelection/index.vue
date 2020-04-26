<template>
  <div>
    <a-input
      style="cursor: pointer;"
      placeholder="Basic usage"
      v-model="userNameLabel"
      readOnly
      @click="showUserModal">
      <a-icon slot="prefix" type="search" />
    </a-input>
    <a-modal
      title="请选择"
      :visible="visible"
      width="460px"
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
      <a-transfer
        :listStyle="style"
        :dataSource="mockData"
        showSearch
        :filterOption="filterOption"
        :targetKeys="targetKeys"
        @change="handleChange"
        @search="handleSearch"
        :render="item=>item.title"
      >
      </a-transfer>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'MultipleSelection',
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
  data () {
    return {
      style: {
        height: '400px'
      },
      // 弹窗
      visible: false,
      confirmLoading: false,
      loading: false,
      // 多选穿梭框
      mockData: [],
      targetKeys: []
    }
  },
  created () {
    this.getMock()
  },
  computed: {
    userNameLabel () {
      const str = []
      this.listData.forEach(item => {
        if (this.value.includes(item.key)) {
          str.push(item.title)
        }
      })
      return str.join(',')
    }
  },
  methods: {
    showUserModal () {
      this.visible = true
    },
    handleOk () {
      this.visible = false
      this.$emit('change', this.targetKeys)
    },
    handleCancel () {
      this.visible = false
      this.$emit('change', this.targetKeys)
    },
    clearHandle () {
      this.targetKeys = []
      this.visible = false
      this.$emit('change', [])
    },
    // 多选穿梭框
    getMock () {
      const mockData = []
      const targetKeys = []
      this.listData.forEach((item, index) => {
        mockData.push({
          key: item.key,
          title: item.title,
          description: 'description of ' + item.title,
          chosen: this.value.includes(item.key)
        })
        if (this.value.includes(item.key)) {
          targetKeys.push(item.key)
        }
      })
      this.mockData = mockData
      this.targetKeys = targetKeys
    },
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      console.log('search:', dir, value)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
