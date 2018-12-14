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
    <el-table :data="orders" highlight-current-row v-loading="listLoading" style="width: 100%;">
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
      <el-table-column label="操作" align="center" min-width="220">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handelShow(scope.row.oId)" v-show="rules.indexOf('01010401') >= 0">查看
          </el-button>
          <el-button type="info" size="small" @click="handelComment(scope.row.cId)" v-show="rules.indexOf('01010402') >= 0">评价信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next" :current-page.sync="page" @current-change="handleCurrentChange" :page-size="pageSize" :total="total * pageSize" style="float:right;">
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
        <el-form-item label="快递公司：">
          <div>{{showForm.expressCompany}}</div>
        </el-form-item>
        <el-form-item label="快递单号：">
          <div>{{showForm.expressId}}</div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 评价 -->
    <el-dialog title="评价详情" :visible.sync="commentTableVisible" class="comment-dialog">
      <dl :data="gridData" class="comment-conatiner">
        <dd v-for="(item,index) in gridData" :key="index">
          <div style="float: left;">
            <img :src="item.c_img" alt="" style="width: 40px;height: 40px;display: block;margin: 0 auto .5em;">
            <span>{{item.evaluate_time.slice(0,11)}}</span>
          </div>
          <div style="" class="content">{{item.u_evaluate}}</div>
        </dd>
      </dl>
      <el-col class="toolbar" v-show="commentTotal > 0">
        <el-pagination layout="prev, pager, next" @current-change="handleCommentCurrentChange" :page-size="commentPageSize" :total="commentTotal * pageSize" style="float:right;">
        </el-pagination>
      </el-col>
    </el-dialog>

  </section>
</template>

<script>
import { getMyAllUOrder, checkComAndRec, selectEvaluate } from 'api/order';
import { mapGetters } from 'vuex';
import util from 'common/js/util';
import Counter from 'base/counter/counter';
const params = JSON.stringify({ type: 0 });

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      totalData: [],
      orders: [],
      total: 0,
      page: 1,
      pageSize: 10,
      rules: sessionStorage.getItem('rules'),
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
      },
      gridData: [],
      commentTableVisible: false,
      commentTotal: 0,
      commentPage: 1,
      commentPageSize: 1
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getTopics() {
      /*
         if (!this.user.account) {
         this.$router.push('/login')
         }
         */
      this.listLoading = true;
      getMyAllUOrder(params).then(res => {
        if (res.success) {
          this.setTopics(res.result.data);
        } else {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
            this.$router.push('/login');
          });
        }

        this.listLoading = false;
      });
    },
    setTopics(data) {
      this.totalData = data.reverse();
      data.map(function(item, index) {
        let time = +new Date(item.endTime) + 3600000;
        data[index].endTime = util.formatDate.format(new Date(time), 'yyyy/MM/dd hh:mm:ss');
      });

      this.total = Math.ceil(this.totalData.length / 10);
      this.orders = data.slice(this.page - 1, 10);
    },
    filterData() {
      let ret = [];
      getMyAllUOrder(params).then(res => {
        if (res.success) {
          this.setTopics(res.result.data);
          // 如果filters条件是空  则正常显示
          if (!this.filters.name) {
            return;
          }
          // 不然按照数据显示
          this.totalData.map((item, index) => {
            for (let val in item) {
              if (ret.indexOf(val) < 0) {
                let tmp = item[val] + '';
                if (tmp.indexOf(this.filters.name) >= 0) {
                  ret.push(item);
                  break;
                }
              }
            }
          });
          this.setTopics(ret);
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      let ret = [];
      for (let i = (val - 1) * 10; i < 10 * val; i++) {
        if (this.totalData[i]) {
          ret.push(this.totalData[i]);
        }
      }
      this.orders = ret;
    },
    getComments(cId) {
      let para = {
        page: this.commentPage,
        cid: cId
      };
      selectEvaluate(para).then(res => {
        if (res.success) {
          if (res.result.data.beanList.length > 0) {
            this.gridData = res.result.data.beanList;
            this.commentTotal = res.result.data.pageNum;
            this.commentPageSize = res.result.data.pageSize;
          } else {
            this.page = 1;
            this.commentTotal = 0;
            this.commentPageSize = 0;
          }
        }
      });
    },
    handelShow(oId) {
      let pars = JSON.stringify({ orderId: oId });
      checkComAndRec(pars).then(
        res => {
          this.showForm = Object.assign({}, res.result);
          this.showFormVisible = true;
        },
        err => {
          console.log(err);
        }
      );
    },
    handleCommentCurrentChange(val) {
      this.commentPage = val;
      this.getComments();
    },
    handelComment(cId) {
      this.getComments(cId);
      this.commentTableVisible = true;
    }
  },
  mounted() {
    this.getTopics();
  },
  components: {
    Counter: Counter
  }
};
</script>

<style scope lang="stylus">
.comment-conatiner {
  min-height: 400px;

  & > dd {
    font-size: 16px;
    border-bottom: 1px dotted #ccc;
    text-indent: 0.5rem;
    padding: 10px 40px;
    overflow: hidden;

    &:last-of-type {
      border-bottom: none;
    }

    .content {
      float: left;
      width: calc(100% - 100px);
      text-indent: 2em;
    }
  }
}
</style>
