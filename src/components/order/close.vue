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
    <el-table :data="orders"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%;">
      <el-table-column prop="oId" label="订单编号" align="center" width="230"></el-table-column>
      <!--<el-table-column prop="cId" label="货号" align="center" width="230"></el-table-column>-->
      <el-table-column prop="cName" label="物品名称" align="center" width="140"></el-table-column>
      <el-table-column prop="rName" label="买家名称" align="center" width="140"></el-table-column>
      <el-table-column prop="rTelephone" label="买家电话" align="center" width="140"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" align="center" width="200"></el-table-column>
      <el-table-column label="操作" align="center" min-width="220">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handelShow(scope.row.oId)"
                     v-show="rules.indexOf('01010501') >= 0">查看</el-button>
          <el-button type="success" size="small" @click="handleRecovery(scope.row.oId)"
                     v-show="rules.indexOf('01010502') >= 0">恢复</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row.oId)"
                     v-show="rules.indexOf('01010503') >= 0">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next"
                     :current-page.sync="page"
                     @current-change="handleCurrentChange"
                     :page-size="pageSize"
                     :total="total * pageSize"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--查看界面-->
    <el-dialog title="查看" v-model="showFormVisible" :close-on-click-modal="false">
      <el-form :model="showForm" label-width="120px" ref="editForm">
        <el-form-item label="图片：" v-show="showForm.img!=='0'">
          <div class="block" style="width: 300px;height: 300px;">
            <el-carousel trigger="click">
              <el-carousel-item v-for="item in showForm.img" :key="item">
                <img :src="item" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-form-item>
        <el-form-item label="视频：" v-show="showForm.video !=='0'">
          <video :src="showForm.video" controls></video>
        </el-form-item>
        <el-form-item label="名字：">
          <div>{{showForm.cName}}</div>
        </el-form-item>
        <el-form-item label="颜色：">
          <div>{{showForm.cColor}}</div>
        </el-form-item>
        <el-form-item label="价格：">
          <div>{{showForm.cPrice}}</div>
        </el-form-item>
        <el-form-item label="尺寸：">
          <div>{{showForm.cSize}}</div>
        </el-form-item>
        <el-form-item label="买家：">
          <div>{{showForm.rName}}</div>
        </el-form-item>
        <el-form-item label="买家电话：">
          <div>{{showForm.rTelephone}}</div>
        </el-form-item>
        <el-form-item label="买家地址：">
          <div>{{showForm.rCity}}{{showForm.rAddress}}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import {getMyAllUOrder, restoreUOrder, checkComAndRec, returnedUOrder} from 'api/order'
  import {mapGetters} from 'vuex'
  const params = JSON.stringify({type: 4})

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        totalData: [],
        orders: [],
        total: 0,
        page: 1,
        rules: sessionStorage.getItem('rules'),
        pageSize: 10,
        listLoading: false,
        sels: [],
        showFormVisible: false, // 查看界面是否显示
        showLoading: false,
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
        }
      }
    },
    computed: {
      ...mapGetters(['user'])
    },
    methods: {
      getTopics () {
        /*
         if (!this.user.account) {
         this.$router.push('/login')
         }
         */
        this.listLoading = true
        getMyAllUOrder(params).then((res) => {
          if (res.success) {
            this.setTopic(res.result.data)
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
      setTopic (data) {
        this.totalData = data.reverse()
        this.total = Math.ceil(this.totalData.length / 10)
        this.orders = data.slice(this.page - 1)
      },
      filterData () {
        let ret = []
        getMyAllUOrder(params).then(res => {
          if (res.success) {
            this.setTopic(res.result.data)
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
            this.setTopic(ret)
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
        this.orders = ret
      },
      handelShow (oId) {
        let pars = JSON.stringify({orderId: oId})
        checkComAndRec(pars).then(res => {
          this.showForm = Object.assign({}, res.result)
          this.showFormVisible = true
        }, err => {
          console.log(err)
        })
      },
      handleRecovery (oId) {
        this.$confirm('确认恢复吗?', '提示', {
          type: 'success'
        }).then(() => {
          this.listLoading = true
          let para = {orderId: oId}
          restoreUOrder(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: '恢复成功',
                type: 'success'
              })
            } else {
              this.$message.error('恢复失败')
            }
            this.getTopics()
          })
        }).catch(() => {
        })
      },
      handleDel (oId) {
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {orderId: oId}
          returnedUOrder(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error('删除失败')
            }
            this.handleCurrentChange(1)
            this.getTopics()
          })
        }).catch(() => {
        })
      }
    },
    mounted () {
      this.getTopics()
    }
  }

</script>

<style scope lang="stylus">

</style>
