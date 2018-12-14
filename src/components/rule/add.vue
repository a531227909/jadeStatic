<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rulesFrom" label-width="80px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="ruleForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="comment">
      <el-input type="textarea" v-model="ruleForm.comment"></el-input>
    </el-form-item>
    <el-form-item label="权限">
      <el-tree :data="rules" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
      </el-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleCreate">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getAllAuthority, addRole } from 'api/authority'

export default {
  data () {
    return {
      ruleForm: {
        roleName: '',
        comment: ''
      },
      rulesFrom: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      rules: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleCreate () {
      let ruls = []
      let child = this.$refs.tree.getCheckedNodes()
      for (let i = 0; i < child.length; i++) {
        ruls.push(child[i].id)
      }
      ruls.map(function (item, index) {
        if (item.length > 7) {
          let temp = item.slice(0, 6)
          let flag = ruls.some(() => {
            return temp.indexOf(ruls) >= 0
          })
          if (!flag) {
            ruls.push(temp)
            ruls.push(temp.slice(0, 4))
          }
        }
      })
      ruls = this.removeDuplicatedItem(ruls)
      this.listLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm, {
            data: ruls
          })
          let ret = []
          params.data.map((item) => {
            ret.push(item)
          })
          params.data = ret.join(',')
          addRole(JSON.stringify(params)).then((res) => {
            if (res.success) {
              this.$confirm('新建角色成功..', '提示', {
                type: 'success'
              }).then(() => {
                this.$router.push('/rule/list')
              })
            } else {
              this.$confirm(res.result.error, '提示', {
                type: 'warning'
              }).then(() => {
                this.$router.push('/rule/add')
              })
            }
          })
        }
        this.listLoading = false
      })
    },
    removeDuplicatedItem (ar) {
      let ret = []
      for (let i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
          ret.push(ar[i])
        }
      }
      return ret
    }
  },
  created () {
    this.listLoading = true
    getAllAuthority(JSON.stringify({})).then((res) => {
      if (!res.success) {
        this.$confirm(res.result.error, '提示', {
          type: 'warning'
        }).then(() => {
        })
      } else {
        this.rules = res.result.data
      }
      this.listLoading = false
    })
  }
}
</script>
