<template>
  <section class="add" v-loading="listLoading">
    <el-form :model="ruleForm" label-width="120px" :rules="rules" ref="ruleForm">
      <el-form-item label="优惠券名称" prop="coupon_name">
        <el-input v-model="ruleForm.coupon_name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="用户类型" prop="user_type">
        <el-input v-model="ruleForm.user_type" auto-complete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="优惠券时间" class="block">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="开始时间" v-model="ruleForm.date_of_start" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="center" :span="2">至</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="结束时间" v-model="ruleForm.date_of_arrival" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="优惠券数量" prop="count">
            <el-input v-model="ruleForm.count"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠券有效期" prop="term_of_validity">
            <el-input v-model="ruleForm.term_of_validity">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="优惠券类型" prop="coupon_type">
            <el-select v-model="ruleForm.coupon_type" placeholder="请选择" @change="valueTypeFlag">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠券规则" prop="coupon_rule_array">
            <el-col :span="2">满</el-col>
            <el-col :span="9">
              <el-input :disabled="valueTypeDis" v-model="ruleForm.coupon_rule_array[0]"></el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="2">减</el-col>
            <el-col :span="9">
              <el-input :disabled="valueTypeDis" v-model="ruleForm.coupon_rule_array[1]"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否开启有效期" prop="is_use_time">
            <el-switch v-model="ruleForm.is_use_time" active-color="#008040" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠券是否启用" prop="status">
            <el-switch v-model="ruleForm.status" active-color="#008040" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click.native="addAction">提交</el-button>
    </div>

    <el-row :gutter="24" style="padding-bottom: 0px;">

    </el-row>

  </section>
</template>

<script>
import { addCoupon } from 'api/coupon';
import Dayjs from 'dayjs';

export default {
  data() {
    return {
      listLoading: false,
      options: [
        {
          value: '',
          label: '无'
        },
        {
          value: '1',
          label: '通用优惠券'
        }
      ],
      valueTypeDis: true,
      value: '',
      ruleForm: {
        coupon_name: '',
        user_type: '1',
        date_of_start: '',
        date_of_arrival: '',
        coupon_type: '',
        coupon_rule: '',
        coupon_rule_array: ['', ''],
        term_of_validity: '',
        is_use_time: false,
        count: '',
        status: true,
        memo: ''
      },
      rules: {
        coupon_name: [{ required: true, message: '优惠券名称', trigger: 'blur' }],
        coupon_type: [{ required: true, message: '优惠券类型', trigger: 'blur' }],
        count: [{ required: true, message: '优惠券数量不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    valueTypeFlag(v) {
      v == '1' ? (this.valueTypeDis = false) : (this.valueTypeDis = true);
    },
    addAction() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm('确定添加吗', '提示', {
            type: 'success'
          }).then(() => {
            this.listLoading = true;
            let start = this.ruleForm.date_of_start;
            let arrival = this.ruleForm.date_of_arrival;
            this.ruleForm.is_use_time = this.ruleForm.is_use_time ? '0' : '1';
            this.ruleForm.status = this.ruleForm.status ? '0' : '1';
            this.ruleForm.date_of_start = Dayjs(start).format('YYYY-MM-DD HH:mm:ss');
            this.ruleForm.date_of_arrival = Dayjs(arrival).format('YYYY-MM-DD HH:mm:ss');
            this.ruleForm.coupon_rule = this.ruleForm.coupon_rule_array[0] + '-' + this.ruleForm.coupon_rule_array[1];
            let params = this.ruleForm;
            addCoupon(params).then(res => {
              if (res.success) {
                this.$confirm('添加成功', '提示', {
                  type: 'success'
                }).then(() => {
                  this.$router.push('/coupon/list');
                });
                this.listLoading = false;
              } else {
                this.$confirm('添加失败', '提示', {
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
  }
};
</script>

<style scope lang="stylus">
.add {
  width: 800px;

  .footer {
    text-align: center;
  }

  .center {
    text-align: center;
  }
}
</style>
