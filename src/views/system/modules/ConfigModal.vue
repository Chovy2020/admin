<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none!important">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数名称">
        <a-input
          placeholder="参数名称"
          v-decorator="['configName', { rules: [{ required: true, message: '请输入参数名称' }] }]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数键名">
        <a-input
          placeholder="参数键名"
          v-decorator="['configKey', { rules: [{ required: true, message: '请输入参数键名' }] }]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参数键值">
        <a-input
          v-decorator="['configValue', { rules: [{ required: true, message: '请输入参数键值' }] }]"
          placeholder="参数键值"
        />
      </a-form-item>
      <a-form-item label="系统内置" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group v-decorator="['configType', { initialValue: 'N' }]">
          <a-radio :value="'Y'">是</a-radio>
          <a-radio :value="'N'">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea
          :rows="5"
          placeholder="备注"
          v-decorator="['remark', { rules: [{ required: true, message: '请输入备注' }] }]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建时间" v-if="mdl.createTime">
        <span>{{ mdl.createTime }}</span>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="更新时间" v-if="mdl.updateTime">
        <span>{{ mdl.updateTime }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveConfig } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'DictModal',
  // props: {
  //   deeps: {
  //     type: Array,
  //     required: true
  //   }
  // },
  components: {},
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      mdl: {},
      options: [],
      city: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    add() {
      this.form.resetFields()
      this.edit({ dictId: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.mdl, 'id', 'configKey', 'configName', 'configType', 'createTime', 'remark', 'configValue')
        )
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveConfig(values)
            .then(res => {
              if (res.code === 51000) {
                this.$message.error('登录已失效，请重新登录')
                setTimeout(() => {
                  location.reload()
                }, 1000)
                return
              }
              if (res.code === 20000) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.success(res.message)
              }
            })
            .catch(() => {
              this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
