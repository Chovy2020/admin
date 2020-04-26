<template>
  <div class="show-modal">
    <div ref="allUser" class="allUser">
      <p>{{ allTitle }}</p>
      <div class="userContent">
        <div class="searchInput">
          <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll"></a-checkbox>
          <a-input :value="searchKey" @change="filterValue" ref="userNameInput">
            <a-tooltip slot="suffix">
              <a-icon type="search" v-show="searchKey === ''" style="color: rgba(0,0,0,.45)" />
              <a-icon type="close-circle" v-show="searchKey !== ''" @click="searchKey = ''" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="listContent">
          <div class="checkboxGroup">
            <a-checkbox-group :options="leftOptions" :value="checkedList" @change="onChange" />
          </div>
          <ul class="letter-list" v-if="type === 'user'">
            <li v-for="item in Letters" :key="item" :style="{background: bgLetter === item ? '#1890ff' : '', color: bgLetter === item ? '#fff' : '#000000a6'}" @click="filterLetter(item)">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div ref="operBtn" class="operBtn">
      <a-button type="primary" shape="circle" icon="right" @click="toRight"></a-button>
      <a-button class="centerBtn" type="primary" shape="circle" icon="left" @click="toLeft"></a-button>
    </div>
    <div ref="chosedUser" class="chosedUser">
      <p>{{ selectedTitle }}</p>
      <div class="userContent">
        <div class="searchInput">
          <a-checkbox :indeterminate="rightIndeterminate" @change="onCheckRightAllChange" :checked="rightCheckAll"></a-checkbox>
        </div>
        <div class="listContent">
          <div class="checkboxGroup">
            <a-checkbox-group :options="rightOptions" :value="rightCheckedList" @change="onRightChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowModal',
  props: {
    type: {
      type: String,
      default: 'user'
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      allTitle: '',
      selectedTitle: '',
      list: [],
      searchKey: '',
      Letters: ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      bgLetter: 'All',
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      // 右框
      rightCheckedList: [],
      rightIndeterminate: false,
      rightCheckAll: false,
      localValue: []
    }
  },
  created () {
    console.log(this.type, 'type')
    this.list = _.cloneDeep(this.listData)
    this.allTitle = this.type === 'user' ? '全部人员' : '全部组群'
    this.selectedTitle = this.type === 'user' ? '已选人员' : '已选组群'
    this.localValue = _.cloneDeep(this.value)
  },
  computed: {
    rightOptions () {
      const options = []
      this.listData.forEach(item => {
        if (this.localValue.includes(item.value)) {
          options.push(item)
        }
      })
      return options
    },
    leftOptions () {
      const options = []
      this.listData.forEach(item => {
        if (!this.localValue.includes(item.value)) {
          if (this.bgLetter === 'All' || item.type === this.bgLetter) {
            if (~item.label.indexOf(this.searchKey)) {
              options.push(item)
            }
          }
        }
      })
      return options
    }
  },
  methods: {
    // 左边全选和单选
    onChange (checkedList) {
      this.indeterminate = checkedList.length > 0 && checkedList.length < this.leftOptions.length
      this.checkAll = checkedList.length === this.leftOptions.length
      this.checkedList = checkedList
    },
    onCheckAllChange (e) {
      this.checkedList = e.target.checked ? this.leftOptions.map(item => item.value) : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    },
    // 右边全选和单选
    onRightChange (checkedList) {
      this.rightIndeterminate = checkedList.length > 0 && checkedList.length < this.localValue.length
      this.rightCheckAll = checkedList.length === this.localValue.length
      this.rightCheckedList = checkedList
    },
    onCheckRightAllChange (e) {
      this.rightCheckedList = e.target.checked ? _.cloneDeep(this.localValue) : []
      this.rightIndeterminate = false
      this.rightCheckAll = e.target.checked
    },
    filterValue (e) {
      this.searchKey = e.target.value
      this.clearCheck()
    },
    filterLetter (item) {
      this.bgLetter = item
      this.clearCheck()
    },
    clearCheck () {
      this.checkAll = false
      this.checkedList = []
    },
    clearRightCheck () {
      this.rightCheckAll = false
      this.rightCheckedList = []
    },
    // 中部按钮
    toRight () {
      const selArr = _.cloneDeep(this.localValue)
      this.localValue = [...new Set([...this.checkedList, ...selArr])]
      this.clearCheck()
      this.indeterminate = this.checkedList.length > 0 && this.checkedList.length < this.leftOptions.length
      this.$emit('change', this.localValue)
    },
    toLeft () {
      this.localValue = _.difference(this.localValue, this.rightCheckedList)
      this.clearRightCheck()
      this.rightIndeterminate = this.rightCheckedList.length > 0 && this.rightCheckedList.length < this.localValue.length
      this.$emit('change', this.localValue)
    },
    clearSelectUserLists () {
      this.localValue = []
      this.$emit('change', [])
    }
  }
}
</script>

<style lang="less" scoped>
  .show-modal {
    background: #fff;
    display: flex;
    width: 582px;
    height: 580px;
    // padding: 50px;

    .allUser, .chosedUser {
      width:248px;
      .userContent {
        border: 1px solid #e8e8e8;
        border-radius: 4px 4px 0 0;

        .searchInput {
          height: 41px;
          padding: 4px;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
        }
      }
    }

    .operBtn {
      width: 85px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .centerBtn {
        margin: 10px 0;
      }
    }

    .listContent {
      position: relative;
      height: 490px;
      .checkboxGroup {
        height: 100%;
        overflow: auto;
      }
      .letter-list {
        list-style-type: none;
        position: absolute;
        right: -15px;
        top: 0;
        font-size: 12px;

        li {
          text-align: center;
          cursor: pointer;
        }
      }
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        cursor: pointer;
      }
    }
    .userlist li {
      padding: 0 5px;
    }
  }

  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }
</style>
