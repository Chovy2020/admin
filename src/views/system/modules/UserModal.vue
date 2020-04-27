<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form" style="max-height: 500px; overflow-y: auto;">
      <a-form-item style="display:none!important">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名">
        <a-input
          placeholder="请输入用户名"
          v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名' }] }]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="昵称">
        <a-input
          v-decorator="[
            'nickName',
            {
              rules: [{ message: '请输入昵称' }]
            }
          ]"
          placeholder="请输入昵称"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电话号码">
        <a-input
          v-decorator="[
            'phone',
            {
              rules: [{ message: '请输入电话号码' }]
            }
          ]"
          placeholder="请输入电话号码"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮箱">
        <a-input
          v-decorator="[
            'email',
            {
              rules: [{ message: '请输入邮箱' }]
            }
          ]"
          placeholder="请输入邮箱"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
        <a-select v-decorator="['status', { initialValue: '0', rules: [{ message: '请选择状态' }] }]">
          <a-select-option :value="'0'">正常</a-select-option>
          <a-select-option :value="'1'">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <!-- <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="部门"
      >
        <a-tree-select
          v-decorator="['deptId', {rules: [{ required: true, message: '请选择部门' }]}]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="deptTree"
          @change="onChange"
          placeholder="部门"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item> -->

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拥有角色" hasFeedback>
        <a-select
          style="width: 100%"
          mode="multiple"
          v-decorator="['roles', { rules: [{ required: true, message: '请选择角色' }] }]"
          :allowClear="true"
        >
          <a-select-option v-for="action in roleAll" :key="action.id">{{ action.roleName }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
        <a-textarea :rows="5" placeholder="..." v-decorator="['remark', { rules: [{ message: '请输入描述' }] }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getRoleAll, saveUser } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'UserModal',
  props: {
    deptTree: {
      type: Array,
      required: true
    }
  },
  components: {},
  data () {
    return {
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
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
      roleAll: [],
      mdl: {},
      deptCheck: true,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {},
  created () {
    this.loadRoleAll({ 'filter_EQ_status': 0 })
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ id: 0, deptId: '' })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.mdl.roles &&
        (this.mdl.roles = this.mdl.roles.map(item => {
          return item.id
        }))
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.mdl, 'id', 'nickName', 'userName', 'phone', 'email', 'status', 'roles', 'remark', 'deptId')
        )
      })
    },
    onChange (value, label, extra) {
      if (extra.triggerNode.$children.length > 0) {
        this.$message.error('不能选择父节点' + `${label}`)
        this.deptCheck = false
      } else {
        this.deptCheck = true
      }
    },
    loadRoleAll (param) {
      getRoleAll(param).then(res => {
        if (res.code === 51000) {
          this.$message.error('登录已失效，请重新登录')
          setTimeout(() => {
            location.reload()
          }, 1000)
          return
        }
        this.roleAll = res.data
        console.log('roleALl', this.roleAll)
      })
    },
    handleSubmit (e) {
      console.log(e)
      e.preventDefault()
      if (!this.deptCheck) {
        this.$message.error('不能选择父节点')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          if (!values.id) {
            delete values.id
          }
          console.log(values)
          values.roles = values.roles.map(item => {
            return { id: item }
          })
          saveUser(values)
            .then(res => {
              if (res.code === 51000) {
                this.$message.error('登录已失效，请重新登录')
                setTimeout(() => {
                  location.reload()
                }, 1000)
                return
              }
              console.log(res, 'saveUser')
              if (res.code === 20000) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.error(res.message)
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
