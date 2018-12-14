<template>
  <section>
    <!--列表-->
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="coupon_name" label="名称" align="center" width="230">
      </el-table-column>
      <el-table-column prop="date_of_start" label="开始时间" align="center" width="230">
      </el-table-column>
      <el-table-column prop="date_of_arrival" label="结束时间" align="center" width="230">
      </el-table-column>
      <el-table-column prop="coupon_rule" label="规则" align="center" width="140">
      </el-table-column>
      <el-table-column prop="term_of_validity" label="有效期" align="center" width="100">
      </el-table-column>
      <el-table-column label="有效期开启" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.is_use_time == '0' ? '开启' : '关闭'}}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="数量" align="center" width="100">
      </el-table-column>
      <el-table-column label="优惠券开启" align="center" width="80">
        <template slot-scope="scope">
          {{scope.row.status == '0' ? '启用' : '停用'}}
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" width="200">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDel(scope.row.coupon_id)">
            删除
          </el-button>
          <el-button type="info" size="small" @click="handleStatus(scope.row.status,scope.row.coupon_id)">
            修改状态
          </el-button>
        </template>
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
import { updateStatus, getList, delCoupon } from 'api/coupon';

export default {
  data() {
    return {
      totalData: [],
      agents: [],
      roles: sessionStorage.getItem('rules'),
      topics: [],
      total: 0,
      curtPage: 1,
      pageSize: 5,
      curtPage: 1,
      totalPages: 1,
      agentsTotalData: [],
      agentsSubUser: [],
      agentTotal: 0,
      agentPage: 1,
      agentPageSize: 5,
      listLoading: false,
      showFormVisible: false, // 查看界面是否显示
      showLoading: false
    };
  },
  methods: {
    getTopics(pages) {
      this.listLoading = true;
      let pageJson = pages ? String(pages) : '1';
      getList({ page: pageJson }).then(res => {
        if (res.success) {
          this.setTopics(res.result, pageJson);
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
    handleDel(coupon_id) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true;
          let para = { coupon_id: coupon_id };
          delCoupon(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: res.result.msg,
                type: 'success'
              });
            } else {
              this.$message.error('删除失败');
            }
            this.getTopics();
          });
        })
        .catch(() => {});
    },
    handleStatus(status, coupon_id) {
      let typeMsg = {
        0: {
          text: '确认启用优惠券吗？',
          colorType: 'primary',
          suc: '启用成功',
          error: '启用失败'
        },
        1: {
          text: '确认停用优惠券吗？',
          colorType: 'warning',
          suc: '停用成功',
          error: '停用失败'
        }
      }[status];

      this.$confirm(typeMsg.text, '提示', {
        type: typeMsg.type
      })
        .then(() => {
          this.listLoading = true;
          let para = { status: status == '0' ? '1' : '0', coupon_id: coupon_id };
          updateStatus(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: typeMsg.suc,
                type: 'success'
              });
            } else {
              this.$message.error(typeMsg.error);
            }
            this.getTopics();
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.getTopics(val);
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
