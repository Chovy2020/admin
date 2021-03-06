<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="12">
            <a-form-item label="参数名称">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_LK_configName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="参数键名">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_LK_configKey" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="系统内置">
              <a-select size="small" placeholder="请选择" v-model="queryParam.filter_LK_configType" default-value="''">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="'Y'">是</a-select-option>
                <a-select-option :value="'N'">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button size="small" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button size="small" style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
          <a-col :md="7" :sm="15" class="table-operator">
            <a-button
              size="small"
              v-if="addEnable"
              type="primary"
              icon="plus"
              @click="$refs.modal.add()"
            >新建</a-button
            >
            <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
              <a-button size="small" type="danger" icon="delete" @click="delByIds(idArr)">删除</a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="configId"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="createTm"
    >
      <span slot="configType" slot-scope="text">{{ text | typeFilter }}</span>
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
    <config-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getConfigList, delConfig } from '@/api/system'
import { checkPermission } from '@/utils/permissions'
import ConfigModal from './modules/ConfigModal'
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    ConfigModal
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
          title: '参数主键',
          dataIndex: 'id',
          align: 'center',
          sorter: true
        },
        {
          title: '参数名称',
          dataIndex: 'configName',
          sorter: true
        },
        {
          title: '参数键名',
          dataIndex: 'configKey',
          sorter: true
        },
        {
          title: '参数键值',
          dataIndex: 'configValue',
          scopedSlots: { customRender: 'configValue' },
          sorter: true
        },
        {
          title: '系统内置',
          dataIndex: 'configType',
          align: 'center',
          scopedSlots: { customRender: 'configType' },
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
          scopedSlots: { customRender: 'remark' },
          sorter: true,
          width: '150px'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const queryParam = { ...this.queryParam }
        if (this.queryParam.filter_LK_configType === '') {
          delete queryParam.filter_LK_configType
        }
        return getConfigList(Object.assign(parameter, queryParam)).then(res => {
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
      addEnable: checkPermission('system:config:add'),
      editEnabel: checkPermission('system:config:edit'),
      removeEnable: checkPermission('system:config:remove')
    }
  },
  filters: {
    typeFilter (type) {
      const typeMap = {
        Y: '是',
        N: '否'
      }
      return typeMap[type]
    }
  },
  beforeCreate () {},
  created () {},
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
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    delByIds (ids) {
      this.$confirm({
        title: '提示',
        content: '真的要删除吗 ?',
        onOk: () => {
          delConfig({ ids: ids.join(',') }).then(res => {
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
