<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input placeholder="搜索" v-model="filters.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="topics"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%;">
      <el-table-column prop="sid" label="ID" align="center" width="230">
      </el-table-column>
      <el-table-column prop="principal" label="代理商名称" align="center" width="230">
      </el-table-column>
      <el-table-column prop="sname" label="负责人" align="center" width="140">
      </el-table-column>
      <el-table-column prop="telephone" label="电话" align="center" width="140">
      </el-table-column>
      <el-table-column prop="ID_number" label="身份证" align="center" width="200">
      </el-table-column>
      <el-table-column label="可分配用户数量" align="center" width="200">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handelShow(scope.row.sid)" v-show="roles.indexOf('01070101') >=0">设置</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="280">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleUser(scope.row)" v-show="roles.indexOf('01070102') >=0">
            用户
          </el-button>
          <el-button type="success" size="small" @click="handleEdit(scope.row)" v-show="roles.indexOf('01070103') >=0">
            修改
          </el-button>
          <el-button type="warning" size="small" @click="handleActive(scope.row.sid)"
                     v-show="roles.indexOf('01070104') >=0 && scope.row.aCancel == 0">激活
          </el-button>
          <el-button type="warning" size="small" @click="handleCancel(scope.row.sid)"
                     v-show="roles.indexOf('01070104') >=0 && scope.row.aCancel == 1">注销
          </el-button>
          <el-button type="warning" size="small" @click="handleDel(scope.row.sid)"
                     v-show="roles.indexOf('01070104') >=0 && scope.row.aCancel == 0">删除
          </el-button>
          <el-button type="danger" size="small" @click="handlePermance(scope.row.sid)"
                     v-show="roles.indexOf('01070105') >=0">业绩
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :page-size="pageSize"
                     :total="total * pageSize"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--修改界面-->
    <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editRuleForm" :inline="true" label-width="120px" :rules="editRules" ref="editRuleForm">
        <el-form-item label="代理商名称：" prop="principal">
          <el-input v-model="editRuleForm.principal" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" prop="sname">
          <el-input v-model="editRuleForm.sname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话：" prop="telephone">
          <el-input v-model="editRuleForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="ID_number">
          <el-input v-model="editRuleForm.ID_number" auto-complete="off"></el-input>
        </el-form-item>
        <div class="line"></div>
        <el-row :gutter="24" style="padding-bottom: 0px;">
          <el-col :span="6">
            <h3 style="font-size: 16px;margin-bottom: 20px;">代理商管理账号
              <el-button size="small" type="primary" @click.stop="addAgentUser">添加</el-button>
            </h3>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="agentsSubUser"
              style="width: 100%" class="editTable">
              <el-table-column
                prop="account"
                label="账号"
                width="180" align="center">
              </el-table-column>
              <el-table-column
                prop="password"
                label="密码"
                width="180" align="center">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="添加时间" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="editAgentUser(scope.row)">编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delAgentUserAction(scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next"
                           @current-change="agentHandleCurrentChange"
                           :page-size="agentPageSize"
                           :total="agentTotal * agentPageSize"
                           style="float:right;">
            </el-pagination>
          </el-col>
          <el-col :span="24" align="center" style="padding: 10px;">
            <el-button type="success" @click.stop.prevent="handleUpdate">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!--设置用户 -->
    <el-dialog title="设置" size="tiny" v-model="setFormVisible" :close-on-click-modal="false">
      <el-form :model="setRuleForm" :inline="true" label-width="120px" :rules="setRules" ref="setRules">
        <el-form-item label="用户数：" prop="userNumber">
          <el-input type="number" v-model="setRuleForm.userNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addUserNumAction">提交</el-button>
      </div>
    </el-dialog>

    <!--查看用户 -->
    <el-dialog :title="'用户 可分配数量' + userNumber + ' 已经分配数量' + haveNumber" :visible.sync="userVisible">
      <el-table :data="userData">
        <el-table-column property="account" label="账号"></el-table-column>
        <el-table-column property="password" label="密码"></el-table-column>
        <el-table-column property="createTime" label="添加时间"></el-table-column>
        <el-table-column property="telephone" label="电话"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleEditSecond(scope.row.sid)">修改</el-button>
            <el-button size="small" type="warning" @click="handleDelSecond(scope.row.sid)">注销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
        <div style="overflow: hidden">
          <el-button type="primary" size="small" style="margin-top:10px;float: right;" @click="handleAddSecond">新增
          </el-button>
        </div>
      -->
    </el-dialog>

    <!--新增用户-->
    <el-dialog title="新增用户" size="tiny" v-model="addUserFormVisible" :close-on-click-modal="false">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserForm">
        <el-form-item label="账号：" prop="userAccount">
          <el-input v-model="addUserForm.userAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="addUserForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPass">
          <el-input type="password" v-model="addUserForm.userPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addUserAction">提交</el-button>
      </div>
    </el-dialog>

    <!--修改用户-->
    <el-dialog title="修改用户" size="tiny" v-model="editUserFormVisible" :close-on-click-modal="false">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserForm">
        <el-form-item label="账号：" prop="userAccount">
          <el-input v-model="editUserForm.userAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="editUserForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPass">
          <el-input type="password" v-model="editUserForm.userPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="editUserAction">提交</el-button>
      </div>
    </el-dialog>

    <!--添加代理商账号-->
    <el-dialog title="添加" size="tiny" v-model="addAgentUserFormVisible" :close-on-click-modal="false">
      <el-form :model="addAgentUserForm" :inline="true" label-width="120px" :rules="addAgentUserRules"
               ref="addAgentUserForm">
        <el-form-item label="账号：" prop="userAccount">
          <el-input v-model="addAgentUserForm.userAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPass">
          <el-input type="password" v-model="addAgentUserForm.userPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addAgentUserAction">提交</el-button>
      </div>
    </el-dialog>

    <!--修改代理商账号-->
    <el-dialog title="修改" size="tiny" v-model="editAgentUserFormVisible" :close-on-click-modal="false">
      <el-form :model="editAgentUserForm" :inline="true" label-width="120px" :rules="editAgentUserRules"
               ref="addAgentUserForm">
        <el-form-item label="账号：" prop="account">
          <el-input v-model="editAgentUserForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="editAgentUserForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="editAgentUserAction">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {
    selectAgent,
    getAgentBySid,
    cancelAgent,
    getUserMessage,
    activationAgent,
    delAgent,
    addAgentAccount,
    updateAgent,
    delUser,
    addUser,
    setUserNumber
  } from 'api/authority'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        totalData: [],
        agents: [],
        roles: sessionStorage.getItem('rules'),
        topics: [],
        total: 0,
        page: 1,
        pageSize: 5,
        agentsTotalData: [],
        agentsSubUser: [],
        agentTotal: 0,
        agentPage: 1,
        agentPageSize: 5,
        options: [{
          value: '0',
          label: '管理员'
        }, {
          value: '1',
          label: '代理账号'
        }, {
          value: '3',
          label: '普通用户'
        }],
        listLoading: false,
        showFormVisible: false, // 查看界面是否显示
        showLoading: false,
        userNumber: 0,  // 用户分配总数量
        haveNumber: 0, // 用户已经分配数量
        showForm: {
          cColor: '',
          rAddress: '',
          cName: '',
          rName: '',
          rTelephone: '',
          cPrice: '',
          rCity: '',
          cSize: '',
          cImg: ''
        },
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editRuleForm: {
          sname: '',
          principal: '',
          telephone: '',
          ID_number: ''
        },
        editRules: {
          sname: [
            {required: true, message: '请输入负责人', trigger: 'blur'}
          ],
          principal: [
            {required: true, message: '请输入代理商', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ],
          ID_number: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
          ]
        },
        setFormVisible: false, // 设置用户数
        setRuleForm: {
          userNumber: ''
        },
        setRules: {
          userNumber: [
            {required: true, message: '请输入用户数', trigger: 'blur'}
          ]
        },
        userVisible: false, // 用户
        userData: [],
        addAgentUserFormVisible: false, // 添加用户
        addAgentUserForm: {
          userAccount: '',
          userPass: ''
        },
        addAgentUserRules: {
          userAccount: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          userPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        editAgentUserFormVisible: false, // 设置用户
        editAgentUserForm: {
          account: '',
          password: ''
        },
        editAgentUserRules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        addUserFormVisible: false,  // 新增用户
        addUserForm: {
          userAccount: '',
          userName: '',
          userPass: ''
        },
        addUserFormRules: {
          userAccount: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          userPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        editUserFormVisible: false,  // 新增用户
        editUserForm: {
          userAccount: '',
          userName: '',
          userPass: ''
        },
        editUserFormRules: {
          userAccount: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          userPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getTopics () {
        this.listLoading = true
        selectAgent().then((res) => {
          if (res.success) {
            this.setTopics(res.result.data)
          } else {
            this.$confirm(res.result.error, '提示', {
              type: 'warning'
            }).then(() => {
              // do...
            })
          }
          this.listLoading = false
        })
      },
      setTopics (data) {
        this.totalData = data
        this.total = Math.ceil(this.totalData.length / 10)
        this.topics = data.slice(this.page - 1, 10)
      },
      setAgentTopics (data) {
        this.agentsTotalData = data
        this.agentTotal = Math.ceil(this.agentsTotalData.length / this.agentPageSize)
        this.agentsSubUser = data.slice(0, this.agentPageSize)
      },
      filterData () {
        let ret = []
        selectAgent().then(res => {
          if (res.success) {
            this.setTopics(res.result.data)
            // 如果filters条件是空  则正常显示
            if (!this.filters.name) {
              return
            }
            // 不然按照数据显示
            this.totalData.map((item, index) => {
              for (let val in item) {
                if (ret.indexOf(val) < 0) {
                  let tmp = item[val] + ''
                  if (tmp.indexOf(this.filters.name) >= 0) {
                    ret.push(item)
                    break
                  }
                }
              }
            })
            this.setTopics(ret)
          }
        })
      },
      handleCurrentChange (val) {
        this.page = val
        let ret = []
        for (let i = (val - 1) * 10; i < 10 * val; i++) {
          if (this.totalData[i]) {
            ret.push(this.totalData[i])
          }
        }
        this.topics = ret
      },
      agentHandleCurrentChange (val) {
        this.agentPage = val
        let ret = []
        for (let i = (val - 1) * this.agentPageSize; i < this.agentPageSize * val; i++) {
          if (this.agentsTotalData[i]) {
            ret.push(this.agentsTotalData[i])
          }
        }
        this.agentsSubUser = ret
      },
      handleEdit (row) {
        sessionStorage.setItem('sub_sid', row.sid)
        let params = JSON.stringify({
          sid: row.sid
        })
        getAgentBySid(params).then((res) => {
          if (res.success) {
            this.agentsTotalData = res.result.data.slice(1)
          } else {
            this.agentsTotalData = []
          }
          this.setAgentTopics(this.agentsTotalData)
          Object.assign(this.editRuleForm, row)
          this.addAgentUserForm = {
            userAccount: '',
            userPass: ''
          }
          this.editFormVisible = true
        })
      },
      handleUser (row) {
        sessionStorage.setItem('sub_sid', row.sid)
        this.listLoading = true
        let para = JSON.stringify({
          'sid': row.sid
        })
        this.userNumber = row.userNumber
        this.haveNumber = row.haveNumber
        getUserMessage(para).then(res => {
          this.userData = res.result.data
          this.userVisible = true
          this.listLoading = false
        })
      },
      handleCancel (sId) {
        this.$confirm('确认注销吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {sid: sId}
          cancelAgent(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: res.result.Agent,
                type: 'success'
              })
            } else {
              this.$message.error('注销失败')
            }
            this.getTopics()
          })
        }).catch(() => {
        })
      },
      handleActive (sId) {
        this.listLoading = true
        let para = {sid: sId}
        activationAgent(para).then((res) => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: res.result.Agent,
              type: 'success'
            })
          } else {
            this.$message.error('激活失败')
          }
          this.getTopics()
        })
      },
      handleDel (sId) {
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {sid: sId}
          delAgent(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: res.result.Agent,
                type: 'success'
              })
            } else {
              this.$message.error('注销失败')
            }
            this.getTopics()
          })
        }).catch(() => {
        })
      },
      handelShow (sId) {
        sessionStorage.setItem('sub_sid', sId)
        this.setFormVisible = true
      },
      addUserNumAction () {
        let params = {
          'sid': sessionStorage.getItem('sub_sid'),
          'userNumber': this.setRuleForm.userNumber
        }
        setUserNumber(params).then((res) => {
          this.setRuleForm.userNumber = ''
          if (res.success) {
            this.$message({
              message: res.result.Agent,
              type: 'success'
            })
            this.getTopics()
          } else {
            this.$message.error('修改失败')
          }
        })
        this.setFormVisible = false
      }, // 添加用户数
      addAgentUserAction () {
        let params = {
          'sid': sessionStorage.getItem('sub_sid'),
          'account': this.addAgentUserForm.userAccount,
          'password': this.addAgentUserForm.userPass
        }
        addAgentAccount(params).then((res) => {
          this.setRuleForm.userNumber = ''
          if (res.success) {
            this.$message({
              message: res.result.data,
              type: 'success'
            })
            this.addAgentUserFormVisible = false
            this.editFormVisible = false
          } else {
            this.$message.error('添加失败')
          }
        })
        this.setFormVisible = false
      },  // 添加代理商账号
      handleUpdate () {
        this.$confirm('确认修改吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = this.editRuleForm
          updateAgent(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: res.result.Agent,
                type: 'success'
              })
            } else {
              this.$message.error('修改失败')
            }
            this.editFormVisible = false
            this.getTopics()
          })
        }).catch(() => {
        })
      }, // 修改代理商注册信息
      handlePermance (sId) {
        sessionStorage.setItem('sub_sid', sId)
        this.$router.push('/agent/' + sId)
      },
      addAgentUser () {
        this.addAgentUserFormVisible = true
      },
      editAgentUser (row) {
        Object.assign(this.editAgentUserForm, row)
        this.editAgentUserFormVisible = true
      },
      editAgentUserAction () {
        let params = Object.assign({
          'sid': sessionStorage.getItem('sub_sid')
        }, this.editAgentUserForm)
        setUserNumber(params).then((res) => {
          this.setRuleForm.userNumber = ''
          if (res.success) {
            this.$message({
              message: res.result.Agent,
              type: 'success'
            })
          } else {
            this.$message.error('修改失败')
          }
        })
        this.editAgentUserFormVisible = false
        this.editFormVisible = false
      },
      delAgentUserAction (row) {
        this.$confirm('确定删除吗', '提示', {
          type: 'warning'
        }).then(() => {
          let params = Object.assign({
            'account': row.account
          })
          params = JSON.stringify(params)
          delUser(params).then((res) => {
            this.setRuleForm.userNumber = ''
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.editAgentUserFormVisible = false
              this.editFormVisible = false
            } else {
              this.$message.error('删除失败')
            }
          })
        })
      },
      handleAddSecond () {
        this.addUserFormVisible = true
      },
      addUserAction () {
        this.$refs.addUserForm.validate((valid) => {
          if (valid) {
            this.listLoading = true
            let para = JSON.stringify({
              'account': this.addUserForm.userAccount,
              'name': this.addUserForm.userName,
              'roleId': sessionStorage.getItem('sub_sid'),
              'password': this.addUserForm.userPass
            })
            console.log(para)
            addUser(para).then((res) => {
              this.listLoading = false
              if (res.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.addUserFormVisible = false
              } else {
                this.$message.error(res.result.error)
              }
              this.userVisible = false
              this.addUserForm = {
                userAccount: '',
                userPass: ''
              }
              this.getTopics()
            })
          }
        })
      }, // 添加用户
      handleEditSecond () {
        this.addUserFormVisible = true
      },
      editUserAction () {
        this.$refs.addUserForm.validate((valid) => {
          if (valid) {
            this.listLoading = true
            let para = JSON.stringify({
              'account': this.addUserForm.userAccount,
              'name': this.addUserForm.userName,
              'roleId': sessionStorage.getItem('sub_sid'),
              'password': this.addUserForm.userPass
            })
            addUser(para).then((res) => {
              this.listLoading = false
              if (res.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加失败')
              }
              this.userVisible = false
              this.addUserForm = {
                userAccount: '',
                userPass: ''
              }
              this.getTopics()
            })
          }
        })
      }, // 修改用户
      handleDelSecond (sId) {
        this.$confirm('确认注销吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {sid: sId}
          cancelAgent(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: res.result.Agent,
                type: 'success'
              })
            } else {
              this.$message.error('注销失败')
            }
            this.getTopics()
          })
        }).catch(() => {
        })
      } // 删除用户
    },
    mounted () {
      this.getTopics()
    }
  }

</script>

<style scope lang="stylus">

  .line
    border-bottom: 1px solid #ccc
    margin-bottom: 12px
</style>
