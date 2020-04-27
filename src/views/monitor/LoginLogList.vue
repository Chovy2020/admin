<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="登录地址">
              <a-input size="small" placeholder="请输入" v-model="queryParam.filter_EQ_ipAddr" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="5" :sm="15">
            <a-form-item label="登录名称">
              <a-input size="small" placeholder="请输入" v-model="queryParam.loginName"/>
            </a-form-item>
          </a-col> -->
          <a-col :md="4" :sm="12">
            <a-form-item label="登录状态">
              <!-- <a-select size="small" placeholder="请选择" v-model="queryParam.status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option v-for="(d, index) in commonStatus" :key="index" :value="d.dictValue">{{
                  d.dictLabel
                }}</a-select-option>
              </a-select> -->
              <a-select size="small" placeholder="请选择" v-model="queryParam.filter_EQ_status" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="0">成功</a-select-option>
                <a-select-option :value="1">失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="18">
            <a-form-item label="登录时间">
              <a-range-picker size="small" v-model="range" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button size="small" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button size="small" style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
          <a-col :md="5" :sm="12" class="table-operator">
            <!-- <a-popconfirm v-has="'monitor:logininfor:remove'" title="确认清空吗？" @confirm="clean">
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button size="small" type="danger" ghost icon="close">清空</a-button>
            </a-popconfirm> -->
            <a-dropdown v-has="'monitor:logininfor:remove'" v-if="selectedRowKeys.length > 0">
              <a-button size="small" type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="infoId"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="loginTime"
    >
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
// import { getLoginLogList, delLoginLog, cleanLoginLog } from '@/api/monitor'
import { getLoginLogList } from '@/api/monitor'
import { getDictArray } from '../../utils/dict'
const commonStatusMap = {}
export default {
  name: 'TableList',
  components: {
    STable
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
          title: '访问编号',
          dataIndex: 'id',
          align: 'center',
          sorter: true
        },
        {
          title: '登录名称',
          dataIndex: 'userName',
          sorter: true
        },
        {
          title: '登录地址',
          dataIndex: 'ipAddr',
          align: 'center',
          sorter: true
        },
        {
          title: '登录地点',
          dataIndex: 'loginLocation',
          align: 'center',
          sorter: true
        },
        {
          title: '浏览器',
          dataIndex: 'browser',
          align: 'center',
          sorter: true
        },
        {
          title: '操作系统',
          dataIndex: 'osType',
          align: 'center',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: { customRender: 'status' },
          sorter: true,
          align: 'center'
        },
        {
          title: '操作信息',
          dataIndex: 'message',
          align: 'center',
          sorter: true
        },
        {
          title: '操作时间',
          dataIndex: 'loginTime',
          align: 'center',
          sorter: true
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.range && this.range.length === 2) {
          this.queryParam.filter_GE_loginTime = moment(this.range[0]).format('YYYY-MM-DD')
          this.queryParam.filter_LE_loginTime = moment(this.range[1]).format('YYYY-MM-DD')
        }
        return getLoginLogList(Object.assign(parameter, this.queryParam)).then(res => {
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
      commonStatus: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    operTypeFilter (type) {
      return commonStatusMap[type].text
    },
    statusFilter (status) {
      const statusMap = {
        '1': '失败',
        '0': '成功'
      }
      return statusMap[status]
    }
  },
  beforeCreate () {},
  async created () {
    // const commonStatus = await getDictArray('sys_common_status')
    // this.commonStatus = commonStatus.data
    // this.commonStatus.map(d => {
    //   commonStatusMap[d.dictValue] = { text: d.dictLabel }
    // })
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      this.$message.success(`你删除了` + ids)
      // delLoginLog({ ids: ids.join(',') }).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(`删除成功`)
      //     this.handleOk()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      //   this.selectedRowKeys = []
      // })
    },
    clean () {
      this.$message.success(`你点击了清空`)
      // cleanLoginLog().then(res => {
      //   this.handleOk()
      // })
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
