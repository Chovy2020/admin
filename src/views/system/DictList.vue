<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="字典名称">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_EQ_dictName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="字典类型">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_EQ_dictType" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="状态">
              <a-select size="small" placeholder="请选择" v-model="queryParam.filter_EQ_status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">正常</a-select-option>
                <a-select-option :value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button size="small" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button size="small" style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="24" class="table-operator">
            <a-button
              size="small"
              v-if="addEnable"
              type="primary"
              icon="plus"
              @click="$refs.modal.add()"
            >新建</a-button
            >
            <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
              <a-button size="small" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data="loadData"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="editEnabel" @click="dataModal(record.dictType)"> <a-icon type="bars" />列表 </a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <dict-modal ref="modal" @ok="handleOk" />
    <dict-data-list-modal ref="datamodal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDictTypeList, delDictType } from '@/api/system'
import DictModal from './modules/DictModal.vue'
import DictDataListModal from './modules/DictDataListModal.vue'
import { checkPermission } from '@/utils/permissions'

const statusMap = {
  0: {
    status: 'success',
    text: '正常'
  },
  1: {
    status: 'default',
    text: '停用'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    DictModal,
    DictDataListModal
  },
  data () {
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
          title: '字典名称',
          dataIndex: 'dictName',
          sorter: true
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTm',
          sorter: true,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          sorter: true
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const queryParam = { ...this.queryParam }
        if (this.queryParam.filter_EQ_status === '') {
          delete queryParam.filter_EQ_status
        }
        return getDictTypeList(Object.assign(parameter, queryParam)).then(res => {
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
      addEnable: checkPermission('system:dict:add'),
      editEnabel: checkPermission('system:dict:edit'),
      removeEnable: checkPermission('system:dict:remove')
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {},
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    dataModal (dictType) {
      this.$refs.datamodal.show(dictType)
    },
    delByIds (ids) {
      this.$confirm({
        title: '提示',
        content: '真的要删除吗 ?',
        onOk: () => {
          delDictType({ ids: ids.join(',') }).then(res => {
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
            this.selectedRowKeys = []
          })
        },
        onCancel: () => {}
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
