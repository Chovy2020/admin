<template>
  <div class="deal-event">
    <a-table
      :columns="columns"
      :dataSource="tableData"
      bordered
      @change="onChange"
      :pagination="pagination">
      <template slot="subject" slot-scope="text, record, index">
        <a href="javascript:;">{{ text }}</a>
      </template>
      <template slot="applyNo" slot-scope="text, record, index">
        <a-icon type="user"/>{{ text }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <a-popconfirm
          v-if="tableData.length"
          title="Sure to delete?"
          @confirm="() => onDelete(index)"
        >
          <a-icon type="delete" />
        </a-popconfirm>
      </template>
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px">
        <a-input
          v-ant-ref="c => searchInput = c"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm)"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm)"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
        >Search</a-button
        >
        <a-button
          @click="() => handleReset(clearFilters)"
          size="small"
          style="width: 90px"
        >Reset</a-button
        >
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
    </a-table>
  </div>
</template>

<script>
import Vue from 'vue'
const scopedSlots = {
  filterDropdown: 'filterDropdown',
  filterIcon: 'filterIcon'
}
export default {
  name: 'DealEvent',
  data () {
    return {
      searchText: '',
      searchInput: null,
      columns: [
        {
          title: 'SN',
          dataIndex: 'key',
          width: '50px',
          align: 'center',
          sorter: (a, b) => a.key - b.key
        },
        {
          title: '申请编号',
          dataIndex: 'applyNo',
          scopedSlots: { ...scopedSlots, customRender: 'applyNo' },
          onFilter: (value, record) => record.applyNo.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          scopedSlots,
          onFilter: (value, record) => record.applyTime.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: '主题',
          dataIndex: 'subject',
          // scopedSlots,
          scopedSlots: { ...scopedSlots, customRender: 'subject' },
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots,
          onFilter: (value, record) => record.status.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: '申请人',
          dataIndex: 'applyPeople',
          scopedSlots,
          onFilter: (value, record) => record.applyPeople.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: '业务类型',
          dataIndex: 'businessType',
          scopedSlots,
          onFilter: (value, record) => record.businessType.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
        },
        {
          title: 'Oper',
          align: 'center',
          width: '50px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [
        {
          key: 1,
          applyNo: 'RMA-CN0455-F1N2019112806',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112806',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 2,
          applyNo: 'RMA-CN0455-F1N2019112807',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112807',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 3,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 4,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 5,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 6,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 7,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 8,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 9,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 10,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        },
        {
          key: 11,
          applyNo: 'RMA-CN0455-F1N2019112808',
          applyTime: '2020-02-01 15:48:15',
          subject: 'RMA-CN0455-F1N2019112808',
          status: '流程中',
          applyPeople: '王燕, Yan Wang(002463)',
          businessType: 'RMA'
        }
      ]
    }
  },
  computed: {
    pagination () {
      return {
        total: this.tableData.length,
        pageSizeOptions: ['10', '20', '30', '40'],
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        showSizeChanger: true
      }
    }
  },
  methods: {
    onDelete (index) {
      const data = _.cloneDeep(this.tableData)
      const arr = []
      data.splice(index, 1)
      data.forEach((item, index) => {
        arr.push(_.cloneDeep(item))
      })
      this.tableData = arr
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    onChange (pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter)
    },
    onFilterDropdownVisibleChange (visible) {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }

  }
}
</script>

<style lang="less" scoped>
  .deal-event {
    ::v-deep .ant-table {
      font-size: 12px!important;
    }
    .anticon-user {
      color: #3c9ffe;
      font-size: 16px;
    }
  }
</style>
