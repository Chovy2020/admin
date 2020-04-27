<template>
  <a-modal title="操作" style="top: 20px;" :width="800" v-model="visible" @ok="handleSubmit">
    <a-form :form="form" style="max-height: 500px; overflow-y: auto;">
      <a-form-item style="display:none!important">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级权限">
        <a-tree-select
          v-decorator="['parentId', { rules: [{ required: true, message: '请选择上级权限' }] }]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="permissions"
          placeholder="上级权限"
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单类型">
        <a-select
          v-decorator="['resType', { initialValue: 'M', rules: [{ required: true, message: '请选择类型' }] }]"
          @select="resTypeChange"
        >
          <a-select-option :value="'M'">目录</a-select-option>
          <a-select-option :value="'C'">菜单</a-select-option>
          <a-select-option :value="'F'">按钮</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限名称">
        <a-input
          v-decorator="['resName', { rules: [{ required: true, message: '请输入权限名称' }] }]"
          placeholder="请输入权限名称"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="路由唯一键">
        <a-input
          v-decorator="['resKey', { initialValue: '', rules: [{ required: true, message: '请输入动态菜单唯一键' }] }]"
          placeholder="路由唯一键：如'user'"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType != 'M'" label="权限标识">
        <a-input
          v-decorator="['perms', { rules: [{ required: false, message: '请输入权限标识' }] }]"
          placeholder="权限标识"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType !== 'F'">
        <span slot="label"
          >组件
          <a-tooltip title="routerUtil中定义的组件或views文件下的路径">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="['component', { rules: [{ required: false, message: '请输入组件' }] }]"
          placeholder="组件"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType !== 'F'" label="图标">
        <a-input
          v-decorator="['icon', { rules: [{ required: false, message: '请选择图标' }] }]"
          ref="iconInput"
          @click="iconselect()"
          enterButton="选择图标"
          placeholder="选择图标"
        >
          <a-icon slot="prefix" :type="icon" />
          <a-icon slot="suffix" type="close-circle" @click="emitEmpty" />
        </a-input>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType === 'C'" label="打开方式">
        <a-select
          v-decorator="[
            'target',
            {
              initialValue: '',
              rules: [{ required: false, message: '请选择打开方式' }, { validator: validatePathTarget }]
            }
          ]"
        >
          <a-select-option :value="''">当前窗口</a-select-option>
          <a-select-option :value="'_blank'">新窗口</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType === 'C'">
        <span slot="label"
          >链接地址
          <a-tooltip title="链接地址为外链时，打开方式必须为新窗口（antd限制）">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
            'path',
            {
              rules: [{ required: false, type: 'string', message: '请输入正确的路径' }]
            }
          ]"
          placeholder="路径"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType !== 'F'" label="重定向地址">
        <a-input
          v-decorator="['redirect', { rules: [{ required: false, message: '请输入重定向地址' }] }]"
          placeholder="重定向地址"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType !== 'F'" label="隐藏子菜单">
        <a-switch v-decorator="['hiddenChildren', { initialValue: false }]" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resType !== 'F'">
        <span slot="label"
          >隐藏头部信息
          <a-tooltip title="隐藏 PageHeader 组件中的页面带的 面包屑和页面标题栏">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-switch v-decorator="['hiddenHeader', { initialValue: false }]" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示顺序">
        <a-input-number
          v-decorator="['sortNo', { initialValue: '1', rules: [{ required: true, message: '请输入顺序数字' }] }]"
          placeholder="显示顺序"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
        <a-select v-decorator="['visible', { initialValue: '0', rules: [{ required: true, message: '请选择状态' }] }]">
          <a-select-option :value="'0'">显示</a-select-option>
          <a-select-option :value="'1'">隐藏</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <iconSelector-modal ref="modal" @ok="setIcon" :icon="icon" />
  </a-modal>
</template>
<script>
import { getPermissions, savePerm } from '@/api/system'
import pick from 'lodash.pick'
import IconSelectorModal from './IconSelectorModal.vue'
export default {
  name: 'UserModal',
  components: {
    IconSelectorModal
  },
  data() {
    return {
      description: '',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      permissions: [{ key: '000000', value: '000000', title: '无' }],
      mdl: {},
      icon: 'smile',
      resType: '',
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {},
  created() {
    this.loadPermissions()
  },
  methods: {
    resTypeChange(type) {
      this.resType = type
    },
    emitEmpty() {
      this.$refs.iconInput.focus()
      this.form.setFieldsValue({ icon: '' })
    },
    iconselect() {
      this.$refs.modal.show()
    },
    setIcon(icon) {
      this.icon = icon
      this.form.setFieldsValue({ icon: icon })
    },
    add(parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || '000000' })
    },
    edit(record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.resType = this.mdl.resType || 'M'
      this.$nextTick(() => {
        this.mdl.icon ? (this.icon = this.mdl.icon) : (this.icon = 'smile')
        this.mdl.parentId += ''
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'icon',
            'id',
            'parentId',
            'resType',
            'visible',
            'perms',
            'target',
            'sortNo',
            'resName',
            'resKey',
            'component',
            'path',
            'redirect',
            'hiddenChildren',
            'hiddenHeader'
          )
        )
        // this.form.setFieldsValue({ ...record })
      })
    },
    validatePathTarget(rule, value, callback) {
      const path = this.form.getFieldValue('path')
      if (path && path.startsWith('http') && value !== '_blank') {
        callback(new Error('链接地址为外链时，打开方式必须为新窗口（antd限制）'))
      } else {
        callback()
      }
    },
    loadPermissions() {
      getPermissions().then(res => {
        this.buildtree(res.data, this.permissions, '000000')
      })
    },
    buildtree(list, arr, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.id,
            value: item.id + '',
            title: item.resName,
            children: []
          }
          this.buildtree(list, child.children, item.id)
          arr.push(child)
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          savePerm(values)
            .then(res => {
              if (res.code === 51000) {
                this.$message.error('登录已失效，请重新登录')
                setTimeout(() => {
                  location.reload()
                }, 1000)
                return
              }
              if (res.code === 20000) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.loadPermissions()
                this.visible = false
              } else {
                this.$message.success(res.msg)
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
