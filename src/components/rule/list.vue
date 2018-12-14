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
      <el-table-column prop="roleId" label="编号" align="center">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="添加日期" align="center">
      </el-table-column>
      <el-table-column prop="addPerson" label="添加人" align="center">
      </el-table-column>
      <el-table-column prop="comment" label="备注" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handelShow(scope.row.roleId)" v-show="roles.indexOf('01060101') >=0">权限</el-button>
          <el-button type="success" size="small" @click="handleEdit(scope.row.roleId)" v-show="roles.indexOf('01060102') >=0">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-show="roles.indexOf('01060103') >=0">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination ref="pagination" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page"
                     :page-size="pageSize" :total="total * pageSize" style="float:right;">
      </el-pagination>
    </el-col>

    <!--查看权限-->
    <el-dialog title="查看/修改" v-model="showFormVisible" :close-on-click-modal="false">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom:20px;">
      </el-input>
      <el-tree class="filter-tree" :data="rules" :props="defaultProps" show-checkbox node-key="id"
               :filter-node-method="filterNode" ref="tree">
      </el-tree>
      <el-button type="danger" @click="handleupdate" style="margin-top:30px;">修改</el-button>
    </el-dialog>

    <!--修改用户-->
    <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rulesFrom" ref="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input type="textarea" v-model="ruleForm.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChange">立即修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import {
    getAllAuthority,
    getRoleList,
    delRole,
    getRoleAuthority,
    updateRole,
    authorityOfDistribution
  } from 'api/authority'

  const params = {}
  export default {
    data () {
      return {
        topics: [{
          comment: '',
          addPerson: '',
          createTime: '',
          reserve1: '',
          reserve2: '',
          roleId: '',
          roleName: ''
        }],
        filters: {
          name: ''
        },
        roles: sessionStorage.getItem('rules'),
        totalData: [],
        total: 0,
        page: 1,
        pageSize: 10,
        listLoading: false,
        showFormVisible: false, // 查看界面是否显示
        showLoading: false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        rules: [],
        ruleForm: {
          roleName: '',
          comment: ''
        },
        rulesFrom: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getTopics () {
        this.listLoading = true
        getRoleList(params).then((res) => {
          if (res.success) {
            this.setTopics(res.result.data)
          } else {
            this.$confirm(res.result.error, '提示', {
              type: 'warning'
            }).then(() => {
              this.$router.push('/login')
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
      filterData () {
        let ret = []
        getRoleList(params).then(res => {
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
      handelShow (roleId) {
        this.listLoading = true
        sessionStorage.setItem('roleId', roleId)
        getAllAuthority({}).then(res => {
          this.rules = res.result.data
          let pars = JSON.stringify({roleId: roleId})
          this.showFormVisible = true
          getRoleAuthority(pars).then(res => {
            let ret = []
            res.result.data.map((item) => {
              item[0] === '0' ? ret.push(item) : ret.push('0' + item)
            })
            this.listLoading = false
            this.$refs.tree.setCheckedKeys(ret)
          }, err => {
            console.log(err)
          })
        })
      },
      handleEdit (roleId) {
        this.listLoading = true
        sessionStorage.setItem('roleId', roleId)
        this.editFormVisible = true
        this.listLoading = false
      },
      handleChange () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.ruleForm, {
              'roleId': sessionStorage.getItem('roleId')
            })
            params = JSON.stringify(params)
            updateRole(params).then((res) => {
              if (res.success) {
                this.$confirm('修改角色成功..', '提示', {
                  type: 'success'
                }).then(() => {
                  this.editFormVisible = false
                  this.getTopics()
                  this.handleCurrentChange(this.page)
                })
              } else {
                this.$confirm(res.result.error, '提示', {
                  type: 'warning'
                }).then(() => {
                  this.$router.push('/rule/list')
                })
              }
            })
          }
        })
      },
      handleDel (row) {
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = JSON.stringify({roleId: row.roleId})
          delRole(para).then((res) => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTopics()
            this.handleCurrentChange(this.page)
          })
        }).catch(() => {
        })
      },
      filterNode (value, data) {
        console.log(value)
        if (!value) {
          return true
        }
        return data.label.indexOf(value) !== -1
      },
      handleupdate () {
        this.$confirm('确认修改吗?', '提示', {
          type: 'success'
        }).then(() => {
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
          ruls = this.removeDuplicatedItem(ruls).join(',')
          let params = JSON.stringify({
            roleId: sessionStorage.getItem('roleId'),
            data: ruls
          })
          console.log(params)
          authorityOfDistribution(params).then((res) => {
            if (res.success) {
              this.$confirm('修改权限成功..', '提示', {
                type: 'success'
              }).then(() => {
                this.showFormVisible = false
                this.getTopics()
                this.$refs.pagination.pageCount = 1
              })
            } else {
              this.$confirm(res.result.error, '提示', {
                type: 'warning'
              }).then(() => {
                this.$router.push('/rule/list')
              })
            }
          })
        }).catch(() => {

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
    mounted () {
      this.getTopics()
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    }
  }
</script>

<style scope lang="stylus">

</style>
