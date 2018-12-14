<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input placeholder="用户名" v-model="filters.account"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" :span="3">
          <el-date-picker type="datetime" v-model="filters.startTime" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" :span="3">
          <el-date-picker type="datetime" v-model="filters.endTime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="account" label="用户名" align="center" width="130">
      </el-table-column>
      <el-table-column prop="order_id" label="订单号" align="center" min-width="185">
      </el-table-column>
      <el-table-column prop="cid" label="商品ID" align="center" width="130">
      </el-table-column>
      <el-table-column label="当前状态" align="center" width="130">
        <template slot-scope="scope">
          {{typeArr[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column prop="sid" label="供应商ID" align="center" width="130">
      </el-table-column>
      <el-table-column prop="order_time" label="下单时间" align="center" width="120">
      </el-table-column>
      <el-table-column prop="receving_time" label="收货时间" align="center" width="120">
      </el-table-column>
      <el-table-column prop="end_time" label="完成时间" align="center" width="120">
      </el-table-column>
      <el-table-column prop="reserve" label="关闭时间" align="center" width="120">
      </el-table-column>
      <el-table-column prop="number" label="数量" align="center" width="100">
      </el-table-column>
      <el-table-column prop="user_coupon_id" label="用户优惠券ID" align="center" width="100">
      </el-table-column>
      <el-table-column prop="money" label="支付金额" align="center" width="100">
      </el-table-column>
      <el-table-column prop="user_coupon_money" label="用户优惠金额" align="center" width="80">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-count="totalPages" :current-page.sync="curtPage" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

  </section>
</template>

<script>
import { getList } from 'api/cencus';
import Dayjs from 'dayjs';

export default {
  data() {
    return {
      filters: {
        account: '',
        startTime: Dayjs()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: Dayjs()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
        page: '1'
      },
      typeArr: ['完成', '待发货', '待收货', '待评价', '关闭'],
      agents: [],
      roles: sessionStorage.getItem('rules'),
      topics: [],
      total: 0,
      curtPage: 1,
      totalPages: 1,
      listLoading: false,
      showFormVisible: false, // 查看界面是否显示
      showLoading: false
    };
  },
  methods: {
    getTopics(pages) {
      this.listLoading = true;
      this.filters.page = pages ? String(pages) : '1';
      let param = Object.assign({}, this.filters);
      let start = Dayjs(param.startTime).format('YYYY-MM-DD HH:mm:ss');
      let end = Dayjs(param.endTime).format('YYYY-MM-DD HH:mm:ss');
      getList({
        page: param.page,
        account: param.account,
        startTime: start,
        endTime: end
      }).then(res => {
        if (res.success) {
          this.setTopics(res.result, param.page);
        } else {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
            // do...
          });
        }
        this.listLoading = false;
      });
    },
    setTopics(res, pages) {
      this.total = Number(res.totalData);
      this.curtPage = Number(pages);
      this.totalPages = Number(res.pages);
      this.topics = res.data;
    },
    handleCurrentChange(page) {
      this.getTopics(page);
    },
    filterData() {
      this.getTopics(1);
    }
  },
  mounted() {
    this.getTopics();
  }
};
</script>

<style scope lang="stylus">
.line {
  border-bottom: 1px solid #ccc;
  margin-bottom: 12px;
}
</style>
