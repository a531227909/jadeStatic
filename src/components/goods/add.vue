<template>
  <section class="add">
    <el-row :gutter="24">
      <el-form
        :model="ruleForm"
        label-width="120px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-col :span="12">
          <el-form-item
            label="一级类别"
            prop="firstId"
          >
            <el-select
              placeholder="请选择"
              v-model="ruleForm.firstId"
              style="width: 268px;"
              @change="firstCate"
            >
              <el-option
                v-for="item in firstCategoryOption"
                :key="item.firstId"
                :label="item.name"
                :value="item.firstId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="二级类别"
            prop="secondId"
          >
            <el-select
              v-model="ruleForm.secondId"
              placeholder="请先选择一级类别"
              style="width: 268px;"
            >
              <el-option
                v-for="item in sectionCategoryOption"
                :key="item.secondId"
                :label="item.name"
                :value="item.secondId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="商品名称"
            prop="name"
          >
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="商品数量区段"
            prop="pcnumber"
            class="sector"
          >
            <el-col :span="5">
              <el-input
                v-model="ruleForm.pcnumber[0]"
                :disabled="true"
              ></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcnumber[1]"></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcnumber[2]"></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcnumber[3]"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="上架天数"
            prop="time"
          >
            <el-input v-model="ruleForm.time">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="商品单价区段"
            prop="pcprice"
            class="sector"
          >
            <el-col :span="5">
              <el-input v-model="ruleForm.pcprice[0]"></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcprice[1]"></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcprice[2]"></el-input>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="5">
              <el-input v-model="ruleForm.pcprice[3]"></el-input>
            </el-col>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="规格一名称"
            prop="sizeName"
          >
            <el-input v-model="ruleForm.sizeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="规格一参数"
            prop="sizeStr"
          >
            <el-input v-model="ruleForm.sizeStr"><template slot="append">
                <el-button
                  type="primary"
                  @click="addSize"
                >添加</el-button>
              </template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格一参数列表">
            <div class="spec_bottom">
              <el-tag
                v-for="tag in ruleForm.sizeData"
                :key="tag"
                closable
                @close="deleteSize(tag)"
                type="primary"
              > {{tag}}
              </el-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="规格二名称"
            prop="colorName"
          >
            <el-input v-model="ruleForm.colorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="规格二参数"
            prop="colorStr"
          >
            <el-input v-model="ruleForm.colorStr"><template slot="append">
                <el-button
                  type="primary"
                  @click="addColor"
                >添加</el-button>
              </template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格二参数列表">
            <div class="spec_bottom">
              <el-tag
                v-for="tag in ruleForm.colorData"
                :key="tag"
                closable
                @close="deleteColor(tag)"
                type="primary"
              > {{tag}}
              </el-tag>
            </div>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="是否上架">
            <el-radio
              class="radio"
              v-model="ruleForm.status"
              label="1"
            >上架</el-radio>
            <el-radio
              class="radio"
              v-model="ruleForm.status"
              label="0"
            >下架</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="商品描述"
            prop="describe"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ruleForm.describe"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="视频/图片"
            prop="principal"
          >
            <el-radio
              class="radio"
              v-model="videoOrPhotos"
              label="0"
            >图片</el-radio>
            <el-radio
              class="radio"
              v-model="videoOrPhotos"
              label="1"
            >视频</el-radio>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-show="videoOrPhotos !== '1'"
        >
          <el-form-item label="商品图片">
            <div style="color:#f00;font-weight: 600;">请上传750px * 750px 以上比例商品图片，图片和视频选一即可。</div>
            <el-upload
              list-type="picture-card"
              name="image"
              multiple
              :action="uploadServer+'/jade/image/uploadImage.action'"
              :before-upload="beforeUpload"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-show="videoOrPhotos === '1'"
        >
          <el-form-item
            label="商品视频"
            prop="principal"
          >
            <div style="color:#f00;font-weight: 600;">请上传播放时间为30s的商品视频，图片和视频选一即可</div>
            <el-upload
              class="upload-demo"
              drag
              :action="uploadServer+'/jade/image/uploadVideo.action'"
              name="image"
              :before-upload="beforeVideoUpload"
              :on-success="handleSuccessVideo"
              :on-remove="handleRemove1"
              style="width: 300px;"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div
                class="el-upload__tip"
                slot="tip"
              >只能上传mp4文件，且不超过50MB</div>
            </el-upload>
            <video
              v-if="videoUrl"
              :src="videoUrl"
              class="avatar"
              controls
            ></video>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-show="videoOrPhotos === '1'"
        >
          <el-form-item label="视频封面">
            <el-upload
              class="avatar-uploader"
              :action="uploadServer+'/jade/image/uploadImage.action'"
              :show-file-list="false"
              name="image"
              :on-success="handleVideoPostSuccess"
            >
              <img
                v-if="videoPostUrl"
                :src="videoPostUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="图文描述"
            prop="imageText"
          >
            <el-upload
              :action="uploadServer+'/jade/image/uploadImage.action'"
              list-type="picture-card"
              :on-success="handleImageText"
              name="image"
              multiple
              :on-remove="handleRemoveImageText"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog
              v-model="dialogVisible"
              size="tiny"
            >
              <img
                width="100%"
                :src="dialogImageUrl"
                alt=""
              >
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="footer">
      <el-button
        type="primary"
        @click.native="addAction"
      >提交</el-button>
    </div>
    <el-row
      :gutter="24"
      style="padding-bottom: 0px;"
    >

    </el-row>
  </section>
</template>

<script>
import {
  getFirstCategory,
  getSecondByFirst,
  addCommodity,
  getCondition
} from "api/goods";
import { uploadServer } from "api/config";

export default {
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 10,
      uploadServer: uploadServer,
      isPull: false,
      options: [
        {
          value: "0",
          label: "管理员"
        },
        {
          value: "1",
          label: "代理账号"
        },
        {
          value: "3",
          label: "普通用户"
        }
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      value: "",
      videoOrPhotos: "0",
      firstCategoryOption: [],
      sectionCategoryOption: [],
      waterOption: [],
      colorOption: [],
      ruleForm: {
        name: "",
        sizeName: "",
        sizeStr: "",
        sizeData: new Array(),
        colorName: "",
        colorStr: "",
        colorData: new Array(),
        size: "",
        price: "",
        pcnumber: ["1", "", "", ""],
        pcprice: ["", "", "", ""],
        firstId: "",
        secondId: "",
        time: "",
        color: "",
        describe: "",
        imageText: "",
        img: "",
        video: "",
        status: "1"
      },
      uploadData: {},
      rules: {
        firstId: [
          { required: true, message: "请输入一级类别", trigger: "blur" }
        ],
        secondId: [
          { required: true, message: "请输入二级类别", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        guige: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
        pcnumber: [
          {
            type: "array",
            required: true,
            message: "请商品数量",
            trigger: "blur"
          }
        ],
        pcprice: [
          {
            type: "array",
            required: true,
            message: "请商品数量",
            trigger: "blur"
          }
        ],
        time: [
          { required: true, message: "请输入上架时间", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value < 0) {
                callback(new Error("不可以小于0"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        describe: [
          { required: true, message: "请输入内容", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择上下架", trigger: "change" }]
      },
      fileList: [],
      videoUrl: "",
      videoPostUrl: "",
      uploadVideoPost: "",
      videoLoading: false,
      uploadImg: []
    };
  },
  methods: {
    handleAvatarSuccess(res, file, fileList) {
      this.uploadImg = fileList;
    },
    // 尺寸
    addSize() {
      let names = String(this.ruleForm.sizeStr);
      if (!this.ruleForm.sizeData) {
        this.ruleForm.sizeData = [];
      }
      if (!this.ruleForm.sizeData.find(item => item === names)) {
        this.ruleForm.sizeData.push(names);
      }
      this.ruleForm.sizeStr = "";
    },
    deleteSize(tag) {
      this.ruleForm.sizeData.splice(this.ruleForm.sizeData.indexOf(tag), 1);
    },
    // 颜色
    addColor() {
      let names = String(this.ruleForm.colorStr);
      if (!this.ruleForm.colorData) {
        this.ruleForm.colorData = [];
      }
      if (!this.ruleForm.colorData.find(item => item === names)) {
        this.ruleForm.colorData.push(names);
      }
      this.ruleForm.colorStr = "";
    },
    deleteColor(tag) {
      this.ruleForm.colorData.splice(this.ruleForm.colorData.indexOf(tag), 1);
    },

    beforeUpload(file) {
      if (file.size > 6 * 1024 * 1024) {
        this.$message({
          type: "error",
          message: "图片不可以超过6MB一张",
          duration: 1000
        });
        return false;
      }
      if (this.uploadImg.length > 9) {
        this.$message({
          type: "error",
          message: "最多上传9张图片",
          duration: 1000
        });
        return false;
      }
    }, // 详情图片最多9张
    handleRemove(file, fileList) {
      this.ruleForm.img = "";
      this.uploadImg = fileList;
    },
    handleVideoPostSuccess(res, file) {
      this.videoPostUrl = URL.createObjectURL(file.raw);
      this.uploadVideoPost = res.result.key;
    },
    getFirst() {
      this.listLoading = true;
      getFirstCategory({}).then(res => {
        this.firstCategoryOption = res.result.data;
        this.listLoading = false;
      });
    },
    init() {
      this.getFirst();
      this.getWaterAndColor();
    },
    getWaterAndColor() {
      this.listLoading = true;
      getCondition({}).then(res => {
        this.waterOption = res.result.water;
        this.colorOption = res.result.color;
        this.listLoading = false;
      });
    },
    handleImageText(response, file, fileList) {
      this.fileList = [];
      for (let i = 0; i < fileList.length; i++) {
        this.fileList.push(fileList[i].response.result.key);
      }
      this.ruleForm.imageText = this.fileList.join(",");
      this.fileList.push(response.result.key);
    },
    handleRemoveImageText(file, fileList) {
      this.fileList = [];
      for (let i = 0; i < fileList.length; i++) {
        this.fileList.push(fileList[i].response.result.key);
      }
      this.ruleForm.imageText = this.fileList.join(",");
      this.ruleForm.imageText = "";
    },
    addAction() {
      if (this.validate()) {
        // 视频和图片
        if (this.videoOrPhotos === "1") {
          // 视频
          if (!this.ruleForm.video) {
            this.$message({
              showClose: true,
              message: "请选择要上传的视频",
              type: "error"
            });
            return;
          } else {
            if (!this.uploadVideoPost) {
              this.$message.error("请先上传视频封面");
              return;
            }
            this.ruleForm.video =
              this.ruleForm.video + "," + this.uploadVideoPost;
          }
        } else {
          // 图片
          //          if (this.uploadImg.length < 3) {
          //            this.$message({
          //              showClose: true,
          //              message: '请上传至少3张的图片',
          //              type: 'error'
          //            })
          //            return
          //          }
          this.ruleForm.video = "0";
        }
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.showLoading = true;
            this.uploadData.size = (this.uploadData.size * 1).toFixed("1");
            if (this.uploadData.size > 100) {
              this.$message.error("size只能是1-100");
              return;
            }
            let params = this.uploadData;
            // 新增参数
            params.size = {
              name: this.ruleForm.sizeName,
              data: this.ruleForm.sizeData.join(",")
            };
            params.color = {
              name: this.ruleForm.colorName,
              data: this.ruleForm.colorData.join(",")
            };
            params.price =
              this.ruleForm.pcnumber.join(",") +
              "-" +
              this.ruleForm.pcprice.join(",");
            console.log(params);
            addCommodity(params).then(res => {
              if (res.success) {
                this.$confirm("新增商品成功", "提示", {
                  type: "success"
                }).then(() => {
                  this.$router.push("/goods/list");
                  return;
                });
              } else {
                this.$confirm(res.result.error, "提示", {
                  type: "warning"
                }).then(() => {
                  // do..
                });
              }
              this.showLoading = false;
            });
          }
        });
      }
    },
    handleSuccess(response) {
      // 上传图片
      this.ruleForm.img = response.result.key;
      this.ruleForm.video = "";
    },
    handleSuccessVideo(response, file) {
      this.videoLoading = false;
      this.videoUrl = file.url;
      this.ruleForm.video = response.result.key;
      this.ruleForm.img = "";
      this.isPull = false;
    },
    handleRemove1() {
      this.ruleForm.video = "";
      this.videoUrl = "";
      this.isPull = false;
    },
    firstCate(val) {
      this.listLoading = true;
      let param = {
        firstId: val
      };
      getSecondByFirst(param).then(res => {
        this.sectionCategoryOption = res.result.data;
        this.listLoading = false;
      });
    },
    beforeVideoUpload(file) {
      if (this.isPull || this.ruleForm.video) {
        this.$message.error("只能上传一个视频");
        return false;
      }
      this.isPull = true;
      const isMP4 = file.type === "video/mp4";
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isMP4) {
        this.$message.error("上传视频只能是MP4格式!");
      }
      if (!isLt50M) {
        this.$message.error("上传视频大小不能超过 50MB!");
      }
      isMP4 && isLt50M ? (this.videoLoading = true) : "";
      return isMP4 && isLt50M;
    }, // 上传视频之前
    validate() {
      this.uploadData = this.ruleForm;
      this.uploadData.videoOrPhotos = this.videoOrPhotos;
      let ret = [];
      if (
        (!this.uploadImg.length && this.videoOrPhotos === "0") ||
        (this.uploadImg.length < 3 && this.videoOrPhotos === "0")
      ) {
        this.$message({
          type: "error",
          message: "至少上传3张商品照片",
          duration: 1000
        });
        return false;
      }
      if (!this.ruleForm.imageText) {
        this.$message({
          type: "error",
          message: "至少上传1张图文描述",
          duration: 1000
        });
        return false;
      }
      if (this.uploadImg) {
        this.uploadImg.map((item, index) => {
          if (index < 9) {
            ret.push(item.response.result.key);
          }
        });
      }
      this.uploadData.img = ret.join(",");
      return true;
    }
  },
  mounted() {
    this.init();
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

.sector {
  .el-col-5 {
    padding-left: 0 !important;
    padding-right: 0 !important;

    input {
      text-align: center;
    }
  }

  .el-col-1 {
    padding-left: 2px !important;
    padding-right: 0 !important;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fbfdff;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}

.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

.spec_bottom {
  height: 95px;
  box-sizing: border-box;
  border: 1px solid #bfcbd9;
  padding: 10px;
  overflow-y: auto;

  span {
    margin-left: 10px;
  }
}
</style>
