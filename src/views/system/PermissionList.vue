<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="唯一键">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_LK_resKey" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="权限名称">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_LK_resName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select size="small" placeholder="请选择" v-model="queryParam.filter_EQ_visible">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="0">显示</a-select-option>
                <a-select-option value="1">隐藏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button size="small" type="primary" @click="fetch">查询</a-button>
              <a-button size="small" style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="15" class="table-operator">
            <a-button
              size="small"
              v-if="addEnable"
              type="primary"
              icon="plus"
              @click="$refs.modal.add()"
            >新建</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      rowKey="id"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="data"
      @change="handleChange"
    >
      <span slot="resType" slot-scope="text">{{ text | resTypeFilter }}</span>

      <span slot="visible" slot-scope="text">{{ text | statusFilter }}</span>

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="addEnable" @click="handleAdd(record.id + '')">新增</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delById(record.id)">删除</a>
      </span>
    </a-table>

    <permission-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { Table as T } from 'ant-design-vue'
import { getPermissions, delPerm } from '@/api/system'
import PermissionModal from './modules/PermissionModal.vue'
import { treeData } from '@/utils/treeutil'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
    PermissionModal
  },
  data () {
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
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},

      // 表头
      columns: [
        {
          title: '权限名称',
          dataIndex: 'resName',
          sorter: true
        },
        {
          title: '路由唯一键',
          dataIndex: 'resKey',
          sorter: true
        },
        {
          title: '组件',
          dataIndex: 'component',
          sorter: true
        },
        {
          title: '排序',
          dataIndex: 'sortNo',
          align: 'center',
          sorter: true
        },
        {
          title: '按钮类型',
          dataIndex: 'resType',
          align: 'center',
          scopedSlots: { customRender: 'resType' },
          sorter: true
        },
        // {
        //   title: '链接',
        //   dataIndex: 'path',
        //   sorter: true
        // },
        // {
        //   title: '重定向',
        //   dataIndex: 'redirect',
        //   sorter: true
        // },
        {
          title: '权限标识',
          dataIndex: 'perms',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'visible',
          align: 'center',
          scopedSlots: { customRender: 'visible' },
          sorter: true
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      pagination: false,
      loading: false,
      addEnable: checkPermission('system:menu:add'),
      editEnabel: checkPermission('system:menu:edit'),
      removeEnable: checkPermission('system:menu:remove')
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '1': '隐藏',
        '0': '显示'
      }
      return statusMap[status]
    },
    resTypeFilter (type) {
      const menuMap = {
        M: '目录',
        F: '按钮',
        C: '菜单'
      }
      return menuMap[type]
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      // this.$refs.table.refresh()
      this.fetch()
    },
    delById (id) {
      this.$confirm({
        title: '提示',
        content: '真的要删除吗 ?',
        onOk: () => {
          delPerm(id).then(res => {
            if (res.code === 51000) {
              this.$message.error('登录已失效，请重新登录')
              setTimeout(() => {
                location.reload()
              }, 1000)
              return
            }
            if (res.code === 20000) {
              this.$message.success(res.message)
              this.handleOk()
            } else {
              this.$message.error(res.message)
            }
          })
        },
        onCancel: () => {}
      })
    },
    handleChange (res) {
      console.log('res', res)
    },
    fetch () {
      this.loading = true
      console.log('fetch', this.queryParam)
      if (!this.queryParam.filter_LK_resKey) {
        delete this.queryParam.filter_LK_resKey
      }
      if (!this.queryParam.filter_LK_resName) {
        delete this.queryParam.filter_LK_resName
      }
      if (!this.queryParam.filter_EQ_visible) {
        delete this.queryParam.filter_EQ_visible
      }
      getPermissions(Object.assign(this.queryParam)).then(res => {
        if (res.code === 51000) {
          this.$message.error('登录已失效，请重新登录')
          setTimeout(() => {
            location.reload()
          }, 1000)
          return
        }
        if (res.code === 20000) {
          console.log('permission', res)
          this.data = treeData(res.data, 'id')
          console.log('data', this.data)
          this.loading = false
        } else {
          this.$message.error(res.message)
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
