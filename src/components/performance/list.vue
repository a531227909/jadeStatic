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
        <el-form-item>
          <el-button type="danger" @click="clearPerformance">清空</el-button>
        </el-form-item>
        <div class="block" style="float: right">
          <el-date-picker v-model="filters.time" type="daterange" placeholder="选择时间范围">
          </el-date-picker>
        </div>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="sid" label="货号" align="center">
      </el-table-column>
      <el-table-column prop="cname" label="物品名称" align="center">
      </el-table-column>
      <el-table-column prop="cprice" label="单价" align="center">
      </el-table-column>
      <el-table-column prop="cnumber" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="fname" label="一级类别" align="center">
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          {{scope.row.endTime.slice(0, 11)}}
        </template>
      </el-table-column>
      <el-table-column prop="ccolor" label="种色" align="center">
      </el-table-column>
      <el-table-column prop="total" label="总价" align="center">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total * pageSize" style="float:right;">
      </el-pagination>
    </el-col>

    <div class="performance-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <h3>当前查询业绩数据</h3>
        </el-col>
      </el-row>
      <div style="height:380px;" class="performance-list" v-show="businessList">
        <template v-for="(item,key) in businessList">
          <el-row :gutter="20" :key="key">
            <el-col :span="4">
              {{key}}销售数量：
            </el-col>
            <el-col :span="1">
              {{item.num}}
            </el-col>
            <el-col :span="4">
              {{key}}类销售总价：
            </el-col>
            <el-col :span="1">
              {{item.price}}
            </el-col>
          </el-row>
        </template>

      </div>
      <div style="height:230px;padding: 0px 10px 12px" class="performance-list" v-show="!businessList">
        <el-row :gutter="20">
          <el-col :span="4">
            暂无数据
          </el-col>
        </el-row>
      </div>
      <div class="line"></div>
      <el-row :gutter="20" class="toolbar">
        <el-col :span="4">
          总销售数量：
        </el-col>
        <el-col :span="1">
          {{totalRows}}
        </el-col>
        <el-col :span="4">
          总销售价格：
        </el-col>
        <el-col :span="1" class="red">
          {{totalSales}}
        </el-col>
      </el-row>
    </div>

  </section>
</template>

<script>
import { delagentPerformance, agentPerformance } from 'api/performance';
import { getToken } from '@/utils/auth';
import { DateUtils } from '@/utils/index';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      filters: {
        name: '',
        time: ''
      },
      totalData: [],
      topics: [],
      total: 0,
      page: 1,
      pageSize: 10,
      listLoading: false,
      businessList: null,
      old: 0,
      totalRows: 0,
      totalSales: 0
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getTopics() {
      this.listLoading = true;
      let sid = getToken();
      let params = JSON.stringify({ sid: sid });
      agentPerformance(params).then(res => {
        if (res.success) {
          this.setTopics(res.result.data);
        } else {
          // do ..
        }
        this.listLoading = false;
      });
    },
    filterData() {
      let ret = [];
      let sid = getToken();
      let params = JSON.stringify({ sid: sid });
      agentPerformance(params).then(res => {
        // 统计时间
        if (res.success) {
          this.setTopics(res.result.data);
          // 如果filters条件是空  则正常显示
          if (!this.filters.name && !this.filters.time) {
            return;
          }
          if (this.filters.name) {
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
          }
          // 时间范围
          if (this.filters.time) {
            if (this.filters.name) {
              let ret2 = [];
              ret.map((item, index) => {
                let t1 = +new Date(item.endTime);
                if (t1 >= +new Date(this.filters.time[0]) && t1 <= +new Date(this.filters.time[1])) {
                  ret2.push(item);
                }
              });
              ret = ret2;
            } else {
              ret = [];
              this.totalData.map((item, index) => {
                let t1 = +new Date(item['endTime']);
                if (t1 >= +new Date(this.filters.time[0]) && t1 <= +new Date(this.filters.time[1])) {
                  ret.push(item);
                }
              });
            }
          }
          this.setTopics(ret);
        }
      });
    },
    setTopics(data) {
      this.totalData = data.reverse();
      this.totalSales = 0;
      this.totalRows = 0;
      let ret = {};
      this.totalData.map((item, index) => {
        if (!ret[item.fname]) {
          ret[item.fname] = {
            num: 0,
            price: 0
          };
        }
        ret[item.fname]['num'] += parseInt(item.cnumber);
        ret[item.fname]['price'] += parseInt(item.total);
      });
      this.businessList = ret;
      for (let key in this.businessList) {
        this.totalSales += parseInt(this.businessList[key].price);
        this.totalRows += parseInt(this.businessList[key].num);
      }
      this.total = Math.ceil(this.totalData.length / 10);
      this.topics = data.slice(this.page - 1, 10);
    },
    clearPerformance() {
      let beginTime = !new Date(this.filters.time)
        ? DateUtils.format(new Date(this.filters.time[0]), 'yyyy-MM-dd HH:mm:ss')
        : '';
      let endTime = !new Date(this.filters.time)
        ? DateUtils.format(new Date(this.filters.time[1]), 'yyyy-MM-dd HH:mm:ss')
        : '';
      let params = {
        beginTime: beginTime,
        endTime: endTime,
        sid: getToken()
      };
      delagentPerformance(params).then(res => {
        if (res.success) {
          this.$message({
            message: '清空成功',
            type: 'success'
          });
          this.getTopics();
          this.handleCurrentChange(1);
        } else {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
            // do ..
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      let ret = [];
      for (let i = (val - 1) * 10; i < 10 * val; i++) {
        if (this.totalData[i]) {
          ret.push(this.totalData[i]);
        }
      }
      this.topics = ret;
    }
  },
  mounted() {
    this.getTopics();
  }
};
</script>

<style scope lang="stylus">
h3 {
  font-size: 17px;
  margin-bottom: 20px;
}

.content-wrapper {
  min-height: 400px;
  margin: 20px auto;

  h3 {
    font-size: 16px;
  }

  .performance-list {
    overflow-x: hidden;
    overflow-y: auto;

    .el-col {
      font-size: 15px;
      margin-bottom: 14px;
    }
  }
}

.performance-container {
  margin-top: 70px;
}

.red {
  color: #f00;
  font-weight: 600;
}
</style>
