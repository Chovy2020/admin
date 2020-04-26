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
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="群组名称">
        <a-input v-decorator="['detail',{rules: [{ required: true, message: '请输入' }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否可用">
        <a-radio-group @change="onChange" v-decorator="['isAvailable',{rules: [{ required: true}]}]">
          <a-radio value="Y">Y</a-radio>
          <a-radio value="N">N</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否隐藏">
        <a-radio-group @change="onChange" v-decorator="['isHidden',{rules: [{ required: true}]}]">
          <a-radio value="Y">Y</a-radio>
          <a-radio value="N">N</a-radio>
        </a-radio-group>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { getGroupList, saveGroup } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'DeptModal',
  components: {
  },
  data () {
    return {
      isAvailable: '',
      isHidden: '',
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      depts: [{ key: '0', value: '0', title: '无' }],
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    getGroupList().then(res => {
      this.buildtree(res.rows, this.depts, 0)
    })
  },
  methods: {
    add (parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || 0 })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        // this.mdl.parentId += ''
        this.form.setFieldsValue(pick(this.mdl, 'id', 'detail', 'isAvailable', 'isHidden'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    buildtree (list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.deptId,
            value: item.deptId + '',
            title: item.deptName,
            children: []
          }
          this.buildtree(list, child.children, item.deptId)
          arr.push(child)
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.$emit('ok')
          this.visible = false
          this.confirmLoading = true
          saveGroup(values).then(res => {
            if (res.code === 20000) {
              this.$message.success(res.message)
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.success(res.message)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    onChange (e) {
      console.log(e.target.value)
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
