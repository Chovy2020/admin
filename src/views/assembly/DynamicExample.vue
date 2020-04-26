<template>
  <div class="dynamic-example">
    <div v-for="(item,index) in lists" :key="item.key" style="margin-bottom: 20px;">
      <a-card :title="`${index+1}.${item.title}`">
        <a href="#" slot="extra">
          <a-popconfirm
            title="Sure to delete?"
            @confirm="() => deleteItem(index)"
          >
            <a-icon type="delete" />
          </a-popconfirm>
        </a>
        <a-form :form="item.form">
          <a-form-item label="Note" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="Gender" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="[
                'gender',
                { rules: [{ required: true, message: 'Please select your gender!' }] },
              ]"
              placeholder="Select a option and change input text above"
              @change="(value) => {item.form.setFieldsValue({
                note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
              })}"
            >
              <a-select-option value="male">male</a-select-option>
              <a-select-option value="female">female</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
    <a-button type="primary" @click="addExample" style="margin-right: 20px;">Add</a-button>
    <a-button type="primary" @click="handleSubmit">提交</a-button>
  </div>

</template>

<script>
import Vue from 'vue'
export default {
  name: 'DynamicExample',
  data () {
    return {
      formLayout: 'horizontal',
      uniqueNo: 1,
      lists: [
        {
          key: this.uniqueNo,
          title: 'Default size card',
          form: this.$form.createForm(this, { name: 'coordinated' })
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    handleSubmit () {
      const form = []
      let validTotal = 0
      this.lists.forEach(item => {
        item.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            validTotal++
            form.push(values)
          }
          if (validTotal === this.lists.length) {
            console.log('可以提交!')
            console.log(form, 'form')
          }
        })
      })
    },
    addExample () {
      this.uniqueNo += 1
      this.lists.push({
        key: this.uniqueNo,
        title: 'Default size card',
        form: this.$form.createForm(this, { name: 'coordinated' })
      })
    },
    deleteItem (index) {
      this.lists.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
  .dynamic-example {

  }
</style>
