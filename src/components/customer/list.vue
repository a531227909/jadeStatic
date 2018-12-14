<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input placeholder="用户名" v-model="filters.account"></el-input>
        </el-form-item>
        <el-form-item label="已读" prop="is_read" :span="3">
          <el-select v-model="filters.is_read" placeholder="请选择是否已读">
            <el-option label="无" value=""></el-option>
            <el-option label="已读" value="0"></el-option>
            <el-option label="未读" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="account" label="用户名" align="center" width="120">
      </el-table-column>
      <el-table-column prop="customer_service" label="客服" align="center" width="120">
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center" min-width="230">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center" width="230">
      </el-table-column>
      <el-table-column prop="is_read" label="已读" align="center" width="100">
        <template slot-scope="scope">
          {{scope.row.is_read == '0' ? '已读' : '未读'}}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center" width="160">
      </el-table-column>
      <el-table-column prop="name" label="名字" align="center" width="100">
      </el-table-column>
      <el-table-column label="详情" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="showInfo(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleReplay(scope.row)">
            回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" v-show="total > 0">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-count="totalPages" :current-page.sync="curtPage" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 查看 -->
    <el-dialog title="查看" v-model="showFormVisible" :close-on-click-modal="false">
      <el-table :data="getInfoForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column prop="account" label="用户名" align="center" width="120">
        </el-table-column>
        <el-table-column prop="customer_service" label="客服" align="center" width="120">
        </el-table-column>
        <el-table-column prop="content" label="内容" align="center" min-width="230">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center" width="230">
        </el-table-column>
        <el-table-column prop="is_read" label="已读" align="center" width="100">
          <template slot-scope="scope">
            {{scope.row.is_read == '0' ? '已读' : '未读'}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center" width="160">
        </el-table-column>
        <el-table-column prop="name" label="名字" align="center" width="100">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 回复 -->
    <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
      <el-row :gutter="24">
        <el-form :model="ruleFormRelay" label-width="120px" :rules="rulesRelp" ref="ruleFormRelay">
          <el-form-item label="用户账户ID" prop="account">
            <el-input v-model="ruleFormRelay.account"></el-input>
          </el-form-item>
          <el-form-item label="回复内容" prop="content">
            <el-input type="textarea" v-model="ruleFormRelay.content"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer" style="text-align: center">
          <el-button type="primary" @click.native="addAction">提交</el-button>
        </div>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import { selectLastByAccount, getCustomerService, replyCustomerService } from 'api/customer';

export default {
  data() {
    return {
      editFormVisible: false,
      ruleFormRelay: {
        account: '',
        content: ''
      },
      rulesRelp: {
        account: [{ required: true, message: '请填写用户账户ID', trigger: 'blur' }],
        content: [{ required: true, message: '请填写回复内容', trigger: 'blur' }]
      },
      flagFliter: false,
      filters: {
        account: '',
        is_read: ''
      },
      getInfoForm: [],
      showFormVisible: false,
      totalData: [],
      agents: [],
      roles: sessionStorage.getItem('rules'),
      topics: [],
      total: 0,
      pageSize: 4,
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
    getTopics(valPage) {
      this.listLoading = true;
      let pages = valPage ? String(valPage) : '1';
      selectLastByAccount({ page: pages, account: this.filters.account, is_read: this.filters.is_read }).then(res => {
        if (res.success) {
          this.setTopics(res.result, pages);
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
    showInfo(list) {
      this.listLoading = true;
      getCustomerService({ account: list.account }).then(res => {
        this.getInfoForm = res.result.data;
        this.showFormVisible = true;
        this.listLoading = false;
      });
    },
    setTopics(res, pages) {
      this.total = Number(res.totalData);
      this.curtPage = Number(pages);
      this.totalPages = Number(res.pages);
      this.topics = res.data;
    },
    filterData() {
      selectLastByAccount({ page: '1', account: this.filters.account, is_read: this.filters.is_read }).then(res => {
        if (res.success) {
          this.setTopics(res.result, '1');
          // 如果filters条件是空  则正常显示
          if (!this.filters.name) {
            return;
          }
          this.listLoading = false;
        }
      });
    },
    handleCurrentChange(val) {
      this.getTopics(val);
    },
    handleReplay(info) {
      this.ruleFormRelay.account = info.account;
      this.editFormVisible = true;
    },

    addAction() {
      this.$refs.ruleFormRelay.validate(valid => {
        if (valid) {
          this.$confirm('确定回复吗', '提示', {
            type: 'success'
          }).then(() => {
            this.editFormVisible = false;
            this.listLoading = true;
            let params = this.ruleFormRelay;
            replyCustomerService(params).then(res => {
              if (res.success) {
                this.$confirm(res.result.CustomerService, '提示', {
                  type: 'success'
                }).then(() => {});
                this.listLoading = false;
              } else {
                this.$confirm('回复失败', '提示', {
                  type: 'warning'
                }).then(() => {
                  // do..
                });
                this.listLoading = false;
              }
            });
          });
        }
      });
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
