<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="角色名称">
              <a-input size="small" placeholder="请输入角色名称" v-model="queryParam.filter_LK_roleName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select size="small" placeholder="请选择状态" v-model="queryParam.filter_EQ_status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">正常</a-select-option>
                <a-select-option :value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button size="small" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button size="small" style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
          <a-col :md="6" :sm="15" class="table-operator">
            <a-button size="small" v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()"
              >新建</a-button
            >
            <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
              <a-button size="small" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <!-- <a-button type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!-- <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0"> -->
      <!-- <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"><a-icon type="lock" />禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>-->
      <!-- <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown> -->
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data="loadData"
    >
      <!-- <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actions.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actions" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>-->
      <span slot="status" slot-scope="text, record">
        <a-switch :checked="record.status == 0" @change="onChangeStatus(record)" />
      </span>
      <span slot="createTm" slot-scope="text, record">{{ record.createTm | dayjs }}</span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <!-- <a v-if="editEnabel" @click="handleScope(record)">数据权限</a>
        <a-divider type="vertical" />-->
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <role-modal ref="modal" @ok="handleOk" />
    <role-scope-modal ref="scopemodal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoleList, delRole, changRoleStatus } from '@/api/system'
import RoleModal from './modules/RoleModal.vue'
import RoleScopeModal from './modules/RoleScopeModal.vue'
import pick from 'lodash.pick'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal,
    RoleScopeModal
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
      form: this.$form.createForm(this),
      mdl: {},
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          sorter: true
        },
        {
          title: '权限字符',
          dataIndex: 'roleKey',
          sorter: true
        },
        {
          title: '显示顺序',
          dataIndex: 'sortNo',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTm',
          scopedSlots: { customRender: 'createTm' },
          sorter: true
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const queryParam = { ...this.queryParam }
        if (this.queryParam.filter_EQ_status === '') {
          delete queryParam.filter_EQ_status
        }
        if (!this.queryParam.filter_LK_roleName) {
          delete queryParam.filter_LK_roleName
        }
        return getRoleList(Object.assign(parameter, queryParam)).then(res => {
          if (res.code === 51000) {
            this.$message.error('登录已失效，请重新登录')
            setTimeout(() => {
              location.reload()
            }, 1000)
            return
          }
          const data = res.data
          data.pageNum = parameter.pageNum
          data.data = data.data.map(item => {
            return { ...item, status: `${item.status}` }
          })
          return data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('system:role:add'),
      editEnabel: checkPermission('system:role:edit'),
      removeEnable: checkPermission('system:role:remove')
    }
  },
  created() {},
  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd(parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleScope(record) {
      this.$refs.scopemodal.edit(record)
    },
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      this.$refs.table.refresh(true)
    },
    delByIds(ids) {
      this.$confirm({
        title: '提示',
        content: '真的要删除吗 ?',
        onOk: () => {
          delRole({ ids: ids.join(',') }).then(res => {
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
            // const difference = new Set(this.selectedRowKeys.filter(x => !new Set(ids).has(x)))
            // this.selectedRowKeys = Array.from(difference)
            this.selectedRowKeys = []
          })
        },
        onCancel: () => {}
      })
    },
    onChangeStatus(record) {
      record.status = record.status === '0' ? '1' : '0'
      changRoleStatus(pick(record, 'id', 'status')).then(res => {
        if (res.code === 51000) {
          this.$message.error('登录已失效，请重新登录')
          setTimeout(() => {
            location.reload()
          }, 1000)
          return
        }
        if (res.code === 20000) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
      // 发送状态到服务器
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
