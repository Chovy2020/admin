<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" style="max-height: 500px; overflow-y: auto;">
      <a-form-item style="display:none!important">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
        <a-input
          v-decorator="[
            'roleName',
            {
              rules: [{ required: true, message: '请输入角色名称' }]
            }
          ]"
          placeholder="请输入角色名称"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限字符">
        <a-input-number
          style="width: 100%"
          v-decorator="['roleKey', { rules: [{ required: true, message: '请输入权限字符' }] }]"
          placeholder="权限字符"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示顺序">
        <a-input-number
          style="width: 100%"
          v-decorator="['sortNo', { rules: [{ required: true, message: '请输入显示顺序' }] }]"
          placeholder="显示顺序"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
        <a-select v-decorator="['status', { initialValue: '0', rules: [{ required: true, message: '请选择状态' }] }]">
          <a-select-option :value="'0'">正常</a-select-option>
          <a-select-option :value="'1'">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-divider />
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拥有权限">
        <!-- v-decorator="['parentId',{initialValue:'0'}]" -->
        <!-- <a-tree
          checkable
          autoExpandParent
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          v-model="checkedKeys"
          @select="onSelect"
          @check="onCheck"
          :selectedKeys="selectedKeys"
          :checkedKeys="checkedKeys"
          :treeData="permissions"
        > -->
        <a-tree checkable v-model="checkedKeys" @check="onCheck" :treeData="permissions"> </a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getPermissions, saveRole } from '@/api/system'
import pick from 'lodash.pick'

export default {
  name: 'RoleModal',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},

      form: this.$form.createForm(this),
      permissions: [],
      treeCheck: false,
      pidSet: [],
      checkedKeys: [],
      halfCheckedKeys: []
    }
  },
  created() {
    this.loadPermissions()
  },
  methods: {
    add() {
      this.form.resetFields()
      this.checkedKeys = []
      this.pidSet = []
      this.edit({})
    },
    edit(record) {
      // if (record.id) {
      //   getRolePermIds(record.id).then(res => {
      //     const pidSet = new Set(res.data.map(m => m.parentId).filter(id => id !== '000000'))
      //     this.pidSet = pidSet
      //     // 因为antd 树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
      //     this.checkedKeys = res.data.map(m => m.id).filter(id => !pidSet.has(id))
      //     console.log(res, 'res')
      //   })
      // }
      if (record.resources && record.resources.length > 0) {
        const pidSet = new Set(record.resources.map(m => m.parentId).filter(id => id !== '000000'))
        this.pidSet = pidSet
        this.checkedKeys = record.resources.map(m => m.id).filter(id => !pidSet.has(id))
      } else {
        this.checkedKeys = []
      }
      console.log('record', record)
      this.mdl = Object.assign({}, record)
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      this.treeCheck = false
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'roleName', 'status', 'sortNo', 'roleKey'))
        // this.form.setFieldsValue(...record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      if (!this.treeCheck) this.treeCheck = true
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    loadPermissions() {
      getPermissions().then(res => {
        this.buildtree(res.data, this.permissions, '000000')
      })
    },
    buildtree(list, permissions, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.id,
            title: item.resName,
            children: []
          }
          this.buildtree(list, child.children, item.id)
          permissions.push(child)
        }
      })
    },
    handleOk(e) {
      const _this = this
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      const checkedAll = this.treeCheck
        ? _this.checkedKeys.concat(_this.halfCheckedKeys)
        : _this.checkedKeys.concat(Array.from(_this.pidSet))
      if (!checkedAll.length > 0) {
        _this.$message.warning('请至少选择一个权限')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.resourceIds = checkedAll
          _this.confirmLoading = true
          if (!values.id) {
            delete values.id
          }
          saveRole(Object.assign(values))
            .then(res => {
              if (res.code === 51000) {
                this.$message.error('登录已失效，请重新登录')
                setTimeout(() => {
                  location.reload()
                }, 1000)
                return
              }
              if (res.code === 20000) {
                _this.$message.success(res.message)
                _this.$emit('ok')
                _this.visible = false
              } else {
                _this.$message.error(res.message)
              }
            })
            .catch(() => {
              _this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped></style>
