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
      <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="noticeCategory" label="类别" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="添加日期" align="center" width="180">
      </el-table-column>
      <el-table-column prop="comment" label="备注" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="220">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleShow(scope.row)" v-show="roles.indexOf('01040101') >=0">浏览</el-button>
          <el-button type="success" size="small" @click="handleActive(scope.row)" v-show="scope.row.online === '0' && roles.indexOf('01040102') >=0">上架
          </el-button>
          <el-button type="warning" size="small" @click="handleCancel(scope.row)" v-show="scope.row.online !== '0' && roles.indexOf('01040102') >=0">下架
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-show="scope.row.online === '0' && roles.indexOf('01040103') >=0">删除
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

    <!--查看界面-->
    <el-dialog title="查看" v-model="showFormVisible" :close-on-click-modal="false" style="text-align: center">
      <img :src="showForm.img" alt="" style="max-width:100%;">
    </el-dialog>
  </section>
</template>

<script>
  import { getNoticeList, delNotice, isONLine, browse } from 'api/notice'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        totalData: [],
        topics: [],
        total: 0,
        page: 1,
        roles: sessionStorage.getItem('rules'),
        pageSize: 10,
        listLoading: false,
        showFormVisible: false, // 查看界面是否显示
        showForm: {
          img: ''
        }
      }
    },
    methods: {
      getTopics () {
        this.listLoading = true
        getNoticeList().then((res) => {
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
        this.totalData = data.reverse()
        this.total = Math.ceil(this.totalData.length / 10)
        this.topics = data.slice(this.page - 1, 10)
      },
      filterData () {
        let ret = []
        getNoticeList({}).then(res => { // 统计时间
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
            // 时间范围
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
      handleCancel (row) {
        this.$confirm('确认下架吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {noticeId: row.noticeId}
          isONLine(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: '商品下架成功',
                type: 'success'
              })
            } else {
              this.$message.error('商品下架失败')
            }
            this.getTopics()
            this.handleCurrentChange(this.page)
          })
        }).catch(() => {
        })
      },
      handleActive (row) {
        this.$confirm('确认上架吗?', '提示', {
          type: 'success'
        }).then(() => {
          this.listLoading = true
          let para = {noticeId: row.noticeId}
          isONLine(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: '商品上架成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.result.error)
            }
            this.getTopics()
            this.handleCurrentChange(this.page)
          })
        }).catch(() => {
        })
      },
      handleDel (row) {
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = JSON.stringify({noticeId: row.noticeId})
          delNotice(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: res.result.notice,
                type: 'success'
              })
            } else {
              this.$message.error('删除失败')
            }
            this.getTopics()
            this.handleCurrentChange(this.page)
          })
        }).catch(() => {
        })
      },
      handleShow (row) {
        this.listLoading = true
        let para = {noticeId: row.noticeId}
        browse(para).then((res) => {
          this.listLoading = false
          this.showForm.img = res.result.img
          this.showFormVisible = true
        })
      }
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
