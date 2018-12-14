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
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="account" label="账号" align="center">
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center">
      </el-table-column>
      <el-table-column prop="uName" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="telephone" label="电话" align="center">
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证" align="center">
      </el-table-column>
      <el-table-column prop="addPerson" label="添加人" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleEdit(scope.row)" v-show="roles.indexOf('01030101') >=0">修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-show="roles.indexOf('01030102') >=0">
            删除
          </el-button>
          <el-button type="danger" size="small" @click="showPerformance(scope.row)">业绩</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination ref="pagination" layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total * pageSize" style="float:right;">
      </el-pagination>
    </el-col>

    <!--修改界面-->
    <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editRuleForm" :inline="true" label-width="120px" :rules="editRules" ref="editRuleForm">
        <el-form-item label="账号：" prop="account">
          <el-input v-model="editRuleForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId">
          <el-select v-model="editRuleForm.roleId" placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名：" prop="uName">
          <el-input v-model="editRuleForm.uName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="telephone">
          <el-input v-model="editRuleForm.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="idNumber">
          <el-input v-model="editRuleForm.idNumber" auto-complete="off"></el-input>
        </el-form-item>
        <br>
        <el-form-item style="margin-left: 40%;margin-bottom: 0;">
          <el-button type="danger" @click="handleUpdate">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--业绩界面-->
    <el-dialog title="查看" size="tiny" v-model="performanceFormVisible" :close-on-click-modal="false" id="yj-tiny">
      <el-row class="condition">
        <el-col :span="10">
          时间段业绩查询：
        </el-col>
        <el-col :span="12" :offset="2">
          <el-date-picker
            v-model="performanceDate"
            type="daterange"
            @change="getUserPerformance"
            format="yyyy-MM-dd"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          购买商品数量：{{performanceNum}}
        </el-col>
        <el-col :span="12" :offset="2">
          总消费数量：{{performancePrice}}
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="topics1" highlight-current-row v-loading="listLoading" style="width: 100%;">
          <el-table-column prop="cid" label="货号" align="center">
          </el-table-column>
          <el-table-column prop="name" label="物品名称" align="center">
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
          </el-table-column>
          <el-table-column prop="color" label="种色" align="center">
          </el-table-column>
          <el-table-column prop="price" label="总价" align="center">
          </el-table-column>
        </el-table>
      </el-row>

    </el-dialog>

  </section>
</template>

<script>
  import {getUserList, getRoleList, UpdateUser, DelUser, getUserPerformance} from 'api/account'
  import {DateUtils} from '@/utils/index'
  const params = {}
  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        roles: sessionStorage.getItem('rules'),
        topics: [],
        totalData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        roleOptions: [],
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editRuleForm: {
          account: '',
          roleId: '',
          telephone: '',
          uName: '',
          idNumber: ''
        },
        editRules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          uName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请输入角色', trigger: 'blur'}
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
        performanceFormVisible: false, // 编辑界面是否显示
        performanceLoading: false,
        performanceDate: '',
        performanceNum: 0,
        performancePrice: 0,
        activeUser: 0,
        totalData1: [],
        totalRows1: 0,
        businessList1: null,
        topics1: [],
        totalSales1: 0
      }
    },
    methods: {
      getTopics () {
        this.listLoading = true
        getUserList(params).then((res) => {
          if (res.success) {
            this.setTopics(res.result.data)
          } else {
            this.$confirm(res.result.error, '提示', {
              type: 'warning'
            }).then(() => {
            })
          }
          this.listLoading = false
        })
      },
      setTopics (data) {
        this.totalData = data.reverse()
        this.total = Math.ceil(this.totalData.length / 10)
        this.topics = data.slice(this.page - 1, 10)
      },
      setTopics1 (data) {
        this.totalData1 = data.reverse()
        this.totalSales1 = 0
        this.totalRows1 = 0
        let ret = {}
        this.totalData1.map((item, index) => {
          if (!ret[item.fname]) {
            ret[item.fname] = {
              num: 0,
              price: 0
            }
          }
          ret[item.fname]['num'] += parseInt(item.cnumber)
          ret[item.fname]['price'] += parseInt(item.total)
        })
        this.businessList1 = ret
        for (let key in this.businessList1) {
          this.totalSales1 += parseInt(this.businessList1[key].price)
          this.totalRows1 += parseInt(this.businessList1[key].num)
        }
        this.topics1 = data
      },
      filterData () {
        let ret = []
        getUserList(params).then(res => {
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
        this.page = (val - 1)
        let ret = []
        for (let i = (val - 1) * 10; i < 10 * val; i++) {
          if (this.totalData[i]) {
            ret.push(this.totalData[i])
          }
        }
        this.topics = ret
      },
      handleEdit (row) {
        sessionStorage.setItem('roleId', row.uComment)
        this.activeUser = row.account
        this.listLoading = true
        getRoleList(JSON.stringify({})).then((res) => {
          if (!res.success) {
            this.$confirm(res.result.error, '提示', {
              type: 'warning'
            }).then(() => {

            })
          } else {
            this.roleOptions = res.result.data
            Object.assign(this.editRuleForm, row)
            this.editRuleForm.roleId = row.uComment
            this.editFormVisible = true
          }
          this.listLoading = false
        })
      },
      handleDel (row) {
        this.activeUser = row.account
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = JSON.stringify({account: row.account})
          DelUser(para).then((res) => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTopics()
          })
        }).catch(() => {
        })
      },
      handleUpdate () {
        this.listLoading = true
        this.$refs.editRuleForm.validate((valid) => {
          if (valid) {
            let filters = ['account', 'idNumber', 'roleId', 'telephone', 'uComment', 'uName']
            let params = {}
            for (let key in this.editRuleForm) {
              filters.some((item) => {
                item === key ? params[key] = this.editRuleForm[key] : ''
              })
            }
            params = JSON.stringify(params)
            UpdateUser(params).then((res) => {
              console.log(res)
              if (res.success) {
                this.$confirm('修改用户成功..', '提示', {
                  type: 'success'
                }).then(() => {
                  this.getTopics()
                  this.editFormVisible = false
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
      },
      showPerformance (row) {
        this.setTopics1([])
        this.activeUser = row.account
        this.performanceFormVisible = true
      },

      getUserPerformance () {
        let params = {
          account: this.activeUser,
          startDate: DateUtils.format(new Date(this.performanceDate[0])),
          endDate: DateUtils.format(new Date(this.performanceDate[1]))
        }
        getUserPerformance(JSON.stringify(params)).then((res) => {
          console.log(res)
          if (res.result.commodity.length > 0) {
            this.setTopics1(res.result.commodity)
          } else {
            this.setTopics1([])
          }
          this.performanceNum = res.result.totalNum
          this.performancePrice = res.result.totalPrice
        })
      }
    },
    mounted () {
      this.getTopics()
    }
  }
</script>

<style scope lang="stylus">
  .condition
    overflow: hidden
    margin-bottom: 20px
    line-height: 40px

  #yj-tiny
    .el-dialog--tiny
      width: 60%
    .el-col-10
      width: auto

</style>
