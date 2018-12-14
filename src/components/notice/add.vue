<template>
  <section class="add">
    <el-form :model="ruleForm" label-width="120px" ref="ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入公告名称" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="ruleForm.noticeCategoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" v-show="ruleForm.noticeCategoryId != 4">
        <el-upload
          class="upload-demo"
          :action="uploadServer+'/jade/image/uploadImage.action'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          name="image"
          list-type="picture">
          <el-button size="small" type="primary" v-show="!this.ruleForm.img">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" v-show="!this.ruleForm.img">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="第一条公告" prop="firstNotice" v-show="ruleForm.noticeCategoryId === '4'">
        <el-input v-model="ruleForm.firstNotice" placeholder="请输入公告，限制字数100" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="第二条公告" prop="secondNoice" v-show="ruleForm.noticeCategoryId === '4'">
        <el-input v-model="ruleForm.secondNoice" placeholder="请输入公告，限制字数100" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="链接宝贝" prop="cid"
                    v-show="ruleForm.noticeCategoryId !== '4'">
        <el-input v-model="ruleForm.cid" placeholder="请输入宝贝货号" auto-complete="off"></el-input>
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
  import {addNotice} from 'api/notice'
  import {uploadServer} from 'api/config'

  export default {
    data () {
      return {
        total: 0,
        page: 1,
        pageSize: 10,
        fileList: [],
        uploadServer: uploadServer,
        options: [{
          value: '1',
          label: '首页轮播图'
        }, {
          value: '2',
          label: '最新宝贝banner图'
        }, {
          value: '3',
          label: '最热宝贝banner图'
        }, {
          value: '4',
          label: '库管头条'
        }],
        ruleForm: {
          'name': '',
          'noticeCategoryId': '1',
          'img': '',
          'cid': '',
          'firstNotice': '',
          'secondNoice': ''
        },
        uploadDate: {}
      }
    },
    methods: {
      handleCurrentChange (val) {
      },
      handleRemove (file, fileList) {
        this.ruleForm.img = ''
      },
      handlePreview (file) {
//        console.log(file)
      },
      handleSuccess (response, file, fileList) {
        this.ruleForm.img = response.result.key
      },
      addAction () {
        this.listLoading = true
        this.valiDate().then(res => {
          if (res === 0) {
            addNotice(this.uploadDate).then((res) => {
              this.listLoading = false
              if (res.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push('/notice/list')
              } else {
                this.$message.error('添加失败')
                this.$router.push('/notice/add')
              }
            })
          }
        })
      },
      valiDate () {
        if (this.ruleForm.noticeCategoryId === '4') { // 库管头条
          this.uploadDate = {
            'name': this.ruleForm.name,
            'noticeCategoryId': this.ruleForm.noticeCategoryId,
            'firstNotice': this.ruleForm.firstNotice,
            'secondNoice': this.ruleForm.secondNoice
          }
        } else {
          if (!this.ruleForm.img) {
            this.$message.error('先上传图片好不好')
            return false
          }
          this.uploadDate = {
            'name': this.ruleForm.name,
            'noticeCategoryId': this.ruleForm.noticeCategoryId,
            'cid': this.ruleForm.cid,
            'img': this.ruleForm.img
          }
        }
        return Promise.resolve(0)
      }
    }
  }

</script>

<style scope lang="stylus">
  .add
    width: 800px
    .footer
      text-align: center
</style>
