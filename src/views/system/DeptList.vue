<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="组群名称" >
              <a-input placeholder="请输入" v-model="queryParam.filter_EQ_detail"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="可用状态">
              <a-select placeholder="请选择" v-model="queryParam.filter_EQ_isAvailable">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="Y">Y</a-select-option>
                <a-select-option value="N">N</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(idArr)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      ssize="default"
      ref="table"
      rowKey="configId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData">

      <span slot="configType" slot-scope="text">
        {{ text | typeFilter }}
      </span>
      <span slot="configValue" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="remark" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>

    <dept-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { Table as T } from 'ant-design-vue'
import { getGroupList, delGroup } from '@/api/system'
import DeptModal from './modules/DeptModal.vue'
// import { treeData } from '@/utils/treeutil'
import { checkPermission } from '@/utils/permissions'
export default {
  name: 'TableList',
  components: {
    T,
    DeptModal,
    STable,
    Ellipsis
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
          title: '群组名称',
          dataIndex: 'detail'
        },
        {
          title: '可用',
          dataIndex: 'isAvailable'
        },
        {
          title: '显示',
          dataIndex: 'isHidden'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      loadData: parameter => {
        const queryParam = { ...this.queryParam }
        if (this.queryParam.filter_EQ_isAvailable === '') {
          delete queryParam.filter_EQ_isAvailable
        }
        return getGroupList(Object.assign(parameter, queryParam))
          .then(res => {
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
      pagination: false,
      loading: false,
      addEnable: checkPermission('system:dept:add'),
      editEnabel: checkPermission('system:dept:edit'),
      removeEnable: checkPermission('system:dept:remove')
    }
  },
  computed: {
    idArr () {
      const idArr = []
      this.selectedRows.forEach(item => {
        idArr.push(item.id)
      })
      return idArr
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
    },
    handleAdd (parentId) {
      this.$refs.modal.add(parentId)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGroup({ ids: ids.join(',') }).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.message)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
      this.selectedRowKeys = []
    }
  }
}
</script>
