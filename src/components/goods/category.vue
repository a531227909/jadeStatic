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
    <el-table :data="topics" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ (scope.$index > 9 ||  scope.$index == 9) ?  (scope.$index + 1) : '0' + (scope.$index + 1)}} 
        </template> </el-table-column> <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column label="展示图" align="center">
        <template slot-scope="scope">
          <img alt="" :src="scope.row.showImg" style="height: 80px;" v-if="scope.row.showImg">
        </template>
      </el-table-column>
      <el-table-column label="样式图" align="center">
        <template slot-scope="scope">
          <img alt="" :src="scope.row.stylrImg" style="height: 80px;margin: 10px;">
        </template>
      </el-table-column>
      <el-table-column label="类别级别" align="center">
        <template slot-scope="scope">
          一级
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleChild(scope.row)" v-show="roles.indexOf('01020401') >=0">
            子类
          </el-button>
          <el-button type="warning" size="small" @click="handleEditFirst(scope.row)" v-show="roles.indexOf('01020402') >=0">修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-show="roles.indexOf('01020403') >=0">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div style="float:right;">
        <el-button type="primary" size="small" @click="handelFirst()" style="margin-top: 2px;" v-show="roles.indexOf('01020404') >=0">
          新增一级类别
        </el-button>
        <el-button type="primary" size="small" @click="handelSecond()" style="margin-top: 2px;margin-right:10px;" v-show="roles.indexOf('01020404') >=0">
          新增二级类别
        </el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total * pageSize" style="float:right;" v-show="total > 0">
        </el-pagination>
      </div>
    </el-col>

    <!--子类界面-->
    <el-dialog title="子类" :visible.sync="showFormVisible">
      <el-table :data="sub_topics">
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            {{ (scope.$index > 9 ||  scope.$index == 9) ?  (scope.$index + 1) : '0' + (scope.$index + 1)}} 
          </template> </el-table-column> <el-table-column prop="name" label="名称" align="center">
        </el-table-column>
        <el-table-column label="样式图" align="center">
          <template slot-scope="scope">
            <img alt="" :src="scope.row.reserve" style="width: 70px;height: 70px;margin: 10px;display: block;">
          </template>
        </el-table-column>
        <el-table-column label="类别级别" align="center">
          <template slot-scope="scope">
            二级
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="220">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="handelEditSecond(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleSubDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="overflow: hidden">
        <el-button type="primary" size="small" style="margin-top:10px;float: right;" @click="handleAddSecond">新增
        </el-button>
      </div>
    </el-dialog>

    <!-- 一级类别  -->
    <el-dialog title="设置" size="tiny" v-model="firstFormVisible" :close-on-click-modal="false">
      <el-form :model="firstRuleForm" label-width="140px" :rules="firstRules" ref="firstRules">
        <el-form-item label="类别名称：" prop="name">
          <el-input v-model="firstRuleForm.name" auto-complete="off" style="width: 380px;"></el-input>
        </el-form-item>
        <el-form-item label="类别展示图：" prop="showImg">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCat" :on-remove="handleRemoveCat" name="image" :fileList="showImg_1" list-type="picture">
            <el-button size="small" type="primary" v-show="!showImg_1.length">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" v-show="!showImg_1.length">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类别样式展示图：" prop="stylrImg">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCatStyle" :on-remove="handleRemoveCatStyle" name="image" :fileList="stylrImg_1" list-type="picture">
            <el-button size="small" type="primary" v-show="!stylrImg_1.length">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" v-show="!stylrImg_1.length">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addFirstAction">提交</el-button>
      </div>
    </el-dialog>

    <!-- 二级类别  -->
    <el-dialog title="设置" size="tiny" v-model="secondFormVisible" :close-on-click-modal="false">
      <el-form :model="secondRuleForm" label-width="140px" :rules="secondRules" ref="secondRules">
        <el-form-item label="类别名称：" prop="name">
          <el-input v-model="secondRuleForm.name" auto-complete="off" style="width: 268px;"></el-input>
        </el-form-item>
        <el-form-item label="所属一级类别：">
          <el-select v-model="secondRuleForm.data" placeholder="请选择" style="width: 268px;">
            <el-option v-for="item in options" :key="item.firstId" :label="item.name" :value="item.firstId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别样式展示图：">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCatStyle2" :on-remove="handleRemoveCatStyle2" name="image" list-type="picture">
            <el-button size="small" type="primary" v-show="!this.stylrImg_2.length">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" v-show="!this.stylrImg_2.length">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addSecondAction">提交</el-button>
      </div>
    </el-dialog>

    <!-- 一级类别添加二级类别 -->
    <el-dialog title="添加" size="tiny" v-model="addSecondFormVisible" :close-on-click-modal="false">
      <el-form :model="addSecondForm" ref="addSecondForm">
        <el-form-item prop="data">
          <el-transfer v-model="addSecondForm.data" :data="secondOption" :titles="['所有类别', '需要新增类别']" :props="{
                          key: 'secondId',
                          label: 'name'
                        }"></el-transfer>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="addSecondByFirstAction">提交</el-button>
      </div>
    </el-dialog>

    <!-- 修改一级类别  -->
    <el-dialog title="修改一级类别" size="tiny" v-model="editFormVisible1" :close-on-click-modal="false" id="editOne">
      <el-form :model="editRuleForm1" label-width="140px" :rules="editRulesForm1" ref="editRulesForm1">
        <el-form-item label="类别名称：" prop="name">
          <el-input v-model="editRuleForm1.name" auto-complete="off" style="width: 268px;"></el-input>
        </el-form-item>
        <el-form-item label="类别展示图：" prop="showImg">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCat" :on-remove="handleRemoveCat" :fileList="showImg_1" name="image" list-type="picture">
            <el-button size="small" type="primary" v-show="!showImg_1.length">点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip" v-show="!showImg_1.length">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类别样式展示图：">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCatStyle" :on-remove="handleRemoveCatStyle" name="image" :fileList="stylrImg_1" list-type="picture">
            <el-button size="small" type="primary" v-show="!stylrImg_1.length">点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip" v-show="!stylrImg_1.length">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="editFirstAction">修改</el-button>
      </div>
    </el-dialog>

    <!-- 修改二级类别  -->
    <el-dialog title="修改二级类别" size="tiny" v-model="editFormVisible2" :close-on-click-modal="false">
      <el-form :model="editRuleForm2" label-width="140px" :rules="editRules2" ref="editRules2">
        <el-form-item label="类别名称：" prop="name">
          <el-input v-model="editRuleForm2.name" auto-complete="off" style="width: 268px;"></el-input>
        </el-form-item>
        <el-form-item label="类别样式展示图：">
          <el-upload class="upload-demo" :action="uploadServer+'/jade/image/uploadImage.action'" :on-success="handleCatStyle2" :on-remove="handleRemoveCatStyle2" name="image" :fileList="stylrImg_2" list-type="picture">
            <el-button size="small" type="primary" v-show="!this.stylrImg_2.length">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" v-show="!this.stylrImg_2.length">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click.native="editChildAction">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getSecondByFirst,
  addCategory,
  getFirstCategory,
  addSecondCategory,
  delCategory,
  delSecondCategory,
  addSecondByFirst,
  updateSecond,
  updateCategory,
  getAllSecondCategory
} from 'api/goods';
import { uploadServer } from 'api/config';

export default {
  data() {
    return {
      filters: {
        name: ''
      },
      totalData: [],
      topics: [],
      total: 0,
      uploadServer: uploadServer,
      page: 1,
      pageSize: 10,
      sub_topics: [],
      listLoading: false,
      showFormVisible: false, // 查看界面是否显示
      showLoading: false,
      showForm: {},
      roles: sessionStorage.getItem('rules'),
      firstFormVisible: false, // 设置用户数
      firstRuleForm: {
        name: '',
        showImg: '',
        stylrImg: ''
      },
      firstRules: {
        // 一级类别规则
        name: [{ required: true, message: '请输入类名', trigger: 'blur' }],
        showImg: [{ required: true, message: '请插入展示图', trigger: 'blur' }],
        stylrImg: [{ required: true, message: '请插入样式展示图', trigger: 'blur' }]
      },
      secondFormVisible: false,
      options: [],
      secondRuleForm: {
        name: '',
        stylrImg: '',
        data: ''
      },
      secondRules: {
        // 二级类别规则
        name: [{ required: true, message: '请输入类名', trigger: 'blur' }],
        stylrImg: [{ required: true, message: '请插入样式展示图', trigger: 'blur' }],
        data: [{ required: true, message: '请选择一级类别', trigger: 'change' }]
      },
      editFormVisible1: false, // 一级修改
      editRuleForm1: {
        name: '',
        showImg: '',
        stylrImg: ''
      },
      editRulesForm1: {
        name: [{ required: true, message: '请输入类名', trigger: 'blur' }],
        showImg: [{ required: true, message: '请插入展示图', trigger: 'blur' }],
        stylrImg: [{ required: true, message: '请插入样式展示图', trigger: 'blur' }]
      },
      showImg_1: [],
      stylrImg_1: [],
      stylrImg_2: [],
      editFormVisible2: false, //  二级修改
      editRuleForm2: {
        name: '',
        stylrImg: ''
      },
      editRules2: {
        name: [{ required: true, message: '请输入类名', trigger: 'blur' }],
        stylrImg: [{ required: true, message: '请插入样式展示图', trigger: 'blur' }]
      },
      addSecondFormVisible: false, //  一级类别增加二级
      addSecondForm: {
        firstId: '',
        data: []
      },
      secondOption: [],
      firstId: '',
      secondId: ''
    };
  },
  methods: {
    getTopics() {
      this.listLoading = true;
      getFirstCategory({}).then(res => {
        if (res.success) {
          this.setTopics(res.result.data);
        } else {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
            // do...
          });
        }
        this.listLoading = false;
      });
    }, // 获取数据
    setTopics(data) {
      this.totalData = data.reverse();
      this.total = Math.ceil(this.totalData.length / 10);
      this.topics = data.slice(this.page - 1, 10);
    }, // 初始化搜索
    filterData() {
      let ret = [];
      getFirstCategory().then(res => {
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
    }, // 搜索事件
    handleCurrentChange(val) {
      this.page = val;
      let ret = [];
      for (let i = (val - 1) * 10; i < 10 * val; i++) {
        if (this.totalData[i]) {
          ret.push(this.totalData[i]);
        }
      }
      this.topics = ret;
    }, // 页码
    handleChild(row) {
      this.listLoading = true;
      this.stylrImg_2 = [];
      let params = JSON.stringify({
        firstId: row.firstId
      });
      this.firstId = row.firstId;
      getSecondByFirst(params).then(res => {
        this.sub_topics = res.result.data;
        this.showFormVisible = true;
        this.listLoading = false;
      });
    }, // 处理子级
    handelFirst() {
      this.showImg_1 = [];
      this.firstFormVisible = true;
    }, // 处理一级类别
    handelSecond() {
      this.stylrImg_1 = [];
      this.listLoading = true;
      this.secondRuleForm = {
        name: '',
        showImg: '',
        stylrImg: '',
        data: ''
      };
      getFirstCategory().then(res => {
        if (res.success) {
          this.options = res.result.data;
          this.secondFormVisible = true;
        } else {
          this.$confirm(res.result.error, '提示', {
            type: 'warning'
          }).then(() => {
            // do...
          });
        }
        this.listLoading = false;
      });
    }, // 处理二级类别
    handleAddSecond() {
      this.addSecondFormVisible = true;
      this.getAllSecondCategoryByFirst();
    }, // 处理一级类别添加二级
    getAllSecondCategoryByFirst() {
      let prams = JSON.stringify({
        firstId: this.firstId
      });
      getAllSecondCategory(prams).then(res => {
        this.addSecondForm = {
          firstId: '',
          data: []
        };
        this.secondOption = res.result.data;
      });
    },
    addSecondByFirstAction() {
      let params = {
        firstId: this.firstId,
        data: this.addSecondForm.data.join(',')
      };
      if (!params.data) {
        this.$message.error('请先选择类别..');
        return;
      }
      params = JSON.stringify(params);
      addSecondByFirst(params).then(res => {
        if (res.success) {
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.addSecondFormVisible = false;
          this.getAllSecondCategoryByFirst();
          this.showFormVisible = false;
        } else {
          this.$message.error('新增失败');
        }
      });
    }, // 提交处理一级类别添加二级
    handleDel(row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true;
          let params = JSON.stringify({
            firstId: row.firstId
          });
          delCategory(params).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error('删除失败');
            }
            this.getTopics();
            this.handleCurrentChange(this.page);
          });
        })
        .catch(() => {});
    }, // 处理一级删除
    handleSubDel(row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.showLoading = true;
          let params = JSON.stringify({
            id: row.id
          });
          delSecondCategory(params).then(res => {
            this.showLoading = false;
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              let params = JSON.stringify({
                firstId: this.firstId
              });
              getSecondByFirst(params).then(res => {
                this.sub_topics = res.result.data;
              });
            } else {
              this.$message.error('删除失败');
            }
          });
        })
        .catch(() => {});
    }, // 处理二级删除
    addFirstAction() {
      this.$refs.firstRules.validate(valid => {
        if (valid) {
          this.listLoading = true;
          let para = JSON.stringify(this.firstRuleForm);
          addCategory(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message.error('修改失败');
            }
            this.firstFormVisible = false;
            this.firstRuleForm = {
              name: '',
              showImg: '',
              stylrImg: ''
            };
            this.getTopics();
          });
        }
      });
    }, // 一级类别提交
    addSecondAction() {
      this.$refs.secondRules.validate(valid => {
        if (valid) {
          this.listLoading = true;
          let para = JSON.stringify(this.secondRuleForm);
          addSecondCategory(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
            } else {
              this.$message.error('新增失败');
            }
            this.secondFormVisible = false;
            this.secondRuleForm = {
              name: '',
              showImg: '',
              stylrImg: '',
              data: ''
            };
            this.getTopics();
          });
        }
      });
    }, // 二级类别提交
    handleEditFirst(row) {
      Object.assign(this.editRuleForm1, row);
      this.showImg_1 = [];
      this.stylrImg_1 = [];

      if (row.showKey) {
        this.showImg_1 = [
          {
            name: row.showKey,
            url: row.showImg
          }
        ];
      } else {
        this.showImg_1 = [];
      }
      if (row.stylrKey) {
        this.stylrImg_1 = [
          {
            name: row.stylrKey,
            url: row.stylrImg
          }
        ];
      } else {
        this.stylrImg_1 = [];
      }
      this.editFormVisible1 = true;
    }, // 调用一级类别修改
    handleCat(response, file) {
      this.firstRuleForm.showImg = response.result.key;
      this.editRuleForm1.showImg = response.result.key;
      this.showImg_1 = [
        {
          name: file.name,
          url: file.url
        }
      ];
    }, // 处理一级分类样式图上传
    handleRemoveCat() {
      this.firstRuleForm.showImg = '';
      this.editRuleForm1.showImg = '';
      this.showImg_1 = [];
    }, // 处理一级分类样式图删除
    handleCatStyle(response, file) {
      // 类别样式展示图 上传
      this.firstRuleForm.stylrImg = response.result.key;
      this.editRuleForm1.stylrImg = response.result.key;
      this.stylrImg_1 = [
        {
          name: file.name,
          url: file.url
        }
      ];
    }, // 处理一级分类展示样式图上传
    handleRemoveCatStyle() {
      // 类别样式展示图 删除
      this.firstRuleForm.stylrImg = '';
      this.editRuleForm1.stylrImg = '';
      this.stylrImg_1 = [];
    }, // 处理一级分类展示样式图删除
    editFirstAction() {
      this.$refs.editRulesForm1.validate(valid => {
        if (valid) {
          this.listLoading = true;
          if (this.editRuleForm1.showImg.length > 100) {
            this.editRuleForm1.showImg = this.editRuleForm1.showKey;
          }
          if (this.editRuleForm1.stylrImg.length > 100) {
            this.editRuleForm1.stylrImg = this.editRuleForm1.stylrKey;
          }
          let para = JSON.stringify(this.editRuleForm1);
          updateCategory(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message.error('修改失败');
            }
            this.firstFormVisible = false;
            this.editRuleForm1 = {
              name: '',
              showImg: '',
              stylrImg: ''
            };
            this.editFormVisible1 = false;
            this.getTopics();
            this.handleCurrentChange(this.page);
          });
        }
      });
    }, // ----  一级类别修改
    handelEditSecond(row) {
      Object.assign(this.editRuleForm2, row);
      this.secondRuleForm.stylrImg = row.reserve1;
      if (row.reserve1) {
        this.stylrImg_2 = [
          {
            name: row.reserve1,
            url: row.reserve
          }
        ];
      } else {
        this.stylrImg_2 = [];
      }
      this.editFormVisible2 = true;
    }, // ---  二级类别
    handleCatStyle2(file, response) {
      // 类别样式展示图 上传
      this.secondRuleForm.stylrImg = file.result.key;
      this.stylrImg_2 = [
        {
          name: file.result.key,
          url: response.url
        }
      ];
    }, // 处理二级分类展示仰视图上传
    handleRemoveCatStyle2(file, fileList) {
      this.secondRuleForm.stylrImg = '';
      this.stylrImg_2 = [];
    }, // 处理二级分类展示样式图删除
    editChildAction() {
      this.editRuleForm2.reserve = this.stylrImg_2.length ? this.stylrImg_2[0].name : '';
      let params = JSON.stringify(this.editRuleForm2);
      updateSecond(params).then(res => {
        if (res.success) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.editFormVisible2 = false;
          this.showFormVisible = false;
          this.getTopics();
        } else {
          this.$message.error('修改失败');
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

#editOne {
  .el-dialog--tiny {
    width: auto;
  }
}
</style>
