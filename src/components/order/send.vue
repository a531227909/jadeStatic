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
      <el-table-column prop="oId" label="订单编号" align="center" width="230">
      </el-table-column>
      <!--<el-table-column prop="cId" label="货号" align="center" width="230"></el-table-column>-->
      <el-table-column prop="cName" label="物品名称" align="center" width="140">
      </el-table-column>
      <el-table-column prop="rName" label="买家名称" align="center" width="140">
      </el-table-column>
      <el-table-column prop="rTelephone" label="买家电话" align="center" width="140">
      </el-table-column>
      <el-table-column prop="orderTime" label="下单时间" align="center" width="200">
      </el-table-column>
      <el-table-column label="自动关闭倒计时" align="center" width="140">
        <template slot-scope="scope">
          <counter :endtime='scope.row.endTime' v-if='scope.row.endTime'></counter>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="220">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handelShow(scope.row.oId)"
                     v-show="rules.indexOf('01010101') >= 0">查看
          </el-button>
          <el-button type="success" size="small" @click="handleSend(scope.row.oId)"
                     v-show="rules.indexOf('01010102') >= 0">发货
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row.oId)"
                     v-show="rules.indexOf('01010103') >= 0">退单
          </el-button>
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
          <div class="block" width="300" height="300">
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

    <!--添加地址-->
    <el-dialog title="添加" size="tiny" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" :inline="true" label-width="120px" :rules="addFormRules"
               ref="addForm">
        <el-form-item label="快递公司：" prop="expressCompany">
          <el-input v-model="addForm.expressCompany" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递编号：" prop="expressId">
          <el-input v-model="addForm.expressId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="sendAction">发货</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import { getMyAllUOrder, returnedUOrder, checkComAndRec, changeUOrderType } from 'api/order'
  import { mapGetters } from 'vuex'
  import util from 'common/js/util'
  import Counter from 'base/counter/counter'
  const params = JSON.stringify({type: 1})

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
        showFormVisible: false, // 查看界面是否显示
        showLoading: false,
        addFormVisible: false,
        addForm: {
          orderId: '',
          expressCompany: '',
          expressId: ''
        },
        addFormRules: {
          expressCompany: [
            {required: true, message: '请输入快递公司', trigger: 'blur'}
          ],
          expressId: [
            {required: true, message: '请输入快递单号', trigger: 'blur'}
          ]
        },
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
        this.listLoading = true
        getMyAllUOrder(params).then((res) => {
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
        data.map(function (item, index) {
          let time = +new Date(item.orderTime) + 3600000  // 一个小时后自动关闭
          data[index].endTime = util.formatDate.format(new Date(time), 'yyyy/MM/dd hh:mm:ss')
        })
        this.total = Math.ceil(this.totalData.length / 10)
        this.orders = data.slice(this.page - 1, 10)
      },
      filterData () {
        let ret = []
        getMyAllUOrder(params).then(res => {
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
      handleSend (oId) {
        this.addForm.orderId = oId
        this.addFormVisible = true
      },
      handleDel (oId) {
        this.$confirm('确认退单吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = {orderId: oId}
          returnedUOrder(para).then((res) => {
            this.listLoading = false
            if (res.success) {
              this.$message({
                message: '退单成功',
                type: 'success'
              })
            } else {
              this.$message.error('退单失败')
            }
            this.getTopics()
            this.handleCurrentChange(this.page)
          })
        }).catch(() => {
        })
      },
      sendAction () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认发货吗?', '提示', {
              type: 'success'
            }).then(() => {
              this.listLoading = true
              let para = JSON.stringify(this.addForm)
              changeUOrderType(para).then((res) => {
                this.listLoading = false
                if (res.success) {
                  this.$message({
                    message: '发货成功',
                    type: 'success'
                  })
                } else {
                  this.$message.error('发货失败')
                }
                this.addFormVisible = false
                this.getTopics()
              })
            }).catch(() => {
            })
          }
        })
      }
    },
    mounted () {
      this.getTopics()
    },
    components: {
      Counter: Counter
    }
  }

</script>

<style scope lang="stylus">

</style>
