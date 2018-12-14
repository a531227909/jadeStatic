<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rulesFrom" label-width="80px">
    <el-form-item label="账号" prop="account">
      <el-input v-model="ruleForm.account"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="身份证" prop="idNumber">
      <el-input v-model="ruleForm.idNumber"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="telephone">
      <el-input v-model="ruleForm.telephone"></el-input>
    </el-form-item>
    <el-form-item label="选择角色" prop="roleId">
      <el-select v-model="ruleForm.roleId" placeholder="请选择">
        <el-option v-for="item in roleOptions" :key="item.value" :label="item.roleName" :value="item.roleId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleCreate">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {getRoleList, addUser} from 'api/account'
  import {getToken} from '@/utils/auth'

  export default {
    data () {
      return {
        ruleForm: {
          'account': '',
          'name': '',
          'roleId': '',
          'telephone': '',
          'password': '',
          'idNumber': ''
        },
        rulesFrom: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入名字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          idNumber: [
            {required: true, message: '请输入身份证', trigger: 'blur'},
            {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern: /(^\d{11}$)/, message: '请输入正确的手机号码', trigger: 'blur'}
          ]
        },
        rules: [],
        roleOptions: []
      }
    },
    methods: {
      handleCreate () {
        this.listLoading = true
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.ruleForm, {
              sid: getToken()
            })
            params = JSON.stringify(params)
            addUser(params).then((res) => {
              if (res.success) {
                this.$confirm('新建用户成功..', '提示', {
                  type: 'success'
                }).then(() => {
                  this.$router.push('/account/list')
                })
              } else {
                this.$confirm(res.result.error, '提示', {
                  type: 'warning'
                }).then(() => {
                  this.$router.push('/account/add')
                })
              }
            })
          }
          this.listLoading = false
        })
      }
    },
    created () {
      this.listLoading = true
      getRoleList(JSON.stringify({})).then((res) => {
        if (!res.success) {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
          })
        } else {
          res.result.data.unshift({
            addPerson: '',
            comment: '这是一个普通用户',
            createTime: '2017-08-11 16:18:30',
            reserve1: null,
            reserve2: null,
            roleId: '1',
            roleName: '用户'
          })
          this.roleOptions = res.result.data

          /*
            if (sessionStorage.getItem('accountType') === '1') {
             this.roleOptions = [{
             addPerson: '',
             comment: '这是一个普通用户',
             createTime: '2017-08-11 16:18:30',
             reserve1: null,
             reserve2: null,
             roleId: '1',
             roleName: '用户'
             }]
             } else {
             res.result.data.unshift({
             addPerson: '',
             comment: '这是一个普通用户',
             createTime: '2017-08-11 16:18:30',
             reserve1: null,
             reserve2: null,
             roleId: '1',
             roleName: '用户'
             })
             this.roleOptions = res.result.data
             }
          */
        }
        this.listLoading = false
      })
    }
  }
</script>
