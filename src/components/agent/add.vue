<template>
  <section class="add" v-loading="listLoading">
    <el-form :model="ruleForm" label-width="120px" :rules="rules" ref="ruleForm">
      <el-form-item label="代理商名称" prop="principal">
        <el-input v-model="ruleForm.principal" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="sname">
        <el-input v-model="ruleForm.sname" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="telephone">
        <el-input v-model="ruleForm.telephone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="IDNumber">
        <el-input v-model="ruleForm.IDNumber" auto-complete="off"></el-input>
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
import { addAgent } from 'api/authority';
//  import util from 'common/js/util'

export default {
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 10,
      listLoading: false,
      options: [
        {
          value: '0',
          label: '管理员'
        },
        {
          value: '1',
          label: '代理账号'
        },
        {
          value: '3',
          label: '普通用户'
        }
      ],
      ruleForm: {
        sname: '',
        principal: '',
        telephone: '',
        IDNumber: ''
      },
      rules: {
        sname: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        principal: [{ required: true, message: '请输入代理商', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /(^\d{11}$)/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        IDNumber: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleCurrentChange(val) {},
    addAction() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm('确定添加吗', '提示', {
            type: 'success'
          }).then(() => {
            this.listLoading = true;
            let params = this.ruleForm;
            addAgent(params).then(res => {
              if (res.success) {
                this.$confirm('添加成功', '提示', {
                  type: 'success'
                }).then(() => {
                  this.$router.push('/agent/list');
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
}
</style>
