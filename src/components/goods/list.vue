<template>
  <section>
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px;"
    >
      <el-form
        :inline="true"
        :model="filters"
      >
        <el-form-item>
          <el-input
            placeholder="搜索"
            v-model="filters.name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="filterData"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table
      :data="topics"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column
        prop="cid"
        label="货号"
        align="center"
        width="230"
      >
      </el-table-column>
      <el-table-column
        prop="firstCategory"
        label="一级类别"
        align="center"
        width="230"
      >
      </el-table-column>
      <el-table-column
        prop="secondCategory"
        label="二级类别"
        align="center"
        width="230"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="物品名称"
        align="center"
        width="140"
      >
      </el-table-column>
      <el-table-column
        label="单价"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          {{ String(scope.row.price).split("-")[1] ? String(scope.row.price).split("-")[1].split(",")[0] : scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column
        prop="shelvesTime"
        label="上架时间"
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="有效天数"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{scope.row.validTime}}天
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="220"
      >
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="handelShow(scope.row)"
            v-show="rules.indexOf('01020101') >= 0"
          >查看
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleEdit(scope.row)"
            v-show="rules.indexOf('01020203') >= 0"
          >修改
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleOutLine(scope.row)"
            v-show="rules.indexOf('01020102') >= 0"
          >下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      v-show="total > 0"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :total="total * pageSize"
        style="float:right;"
      >
      </el-pagination>
    </el-col>

    <!--查看界面-->
    <el-dialog
      title="查看"
      v-model="showFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="showForm"
        label-width="120px"
      >
        <el-form-item
          label="图片："
          v-show="showForm.img.length"
        >
          <div
            class="block"
            style="width: 300px;height: 300px;"
          >
            <el-carousel trigger="click">
              <el-carousel-item
                v-for="(item,index) in showForm.img"
                :key="index"
              >
                <img
                  :src="item.url"
                  style="width: 100%;height: 100%;"
                >
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-form-item>
        <el-form-item
          label="视频："
          v-show="!showForm.img.length"
        >
          <video
            :src="showForm.video.url"
            controls
          ></video>
        </el-form-item>
        <!--<el-form-item label="货号：">
          <div>{{showForm.cid}}</div>
        </el-form-item>-->
        <el-form-item label="名字：">
          <div>{{showForm.name}}</div>
        </el-form-item>
        <el-form-item label="价格：">
          <div>{{ String(showForm.price).split("-")[1] ? String(showForm.price).split("-")[1].split(",")[0] : showForm.price}}</div>
        </el-form-item>
        <el-form-item label="规格一名称：">
          <div>{{ showForm.sizeName }}</div>
        </el-form-item>
        <el-form-item label="规格一参数列表：">
          <div class="spec_bottom">
            <el-tag
              v-for="tag in showForm.sizeData"
              v-show="showForm.sizeData.length > 0"
              :key="tag"
              type="primary"
            >
              {{tag}}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="规格二名称：">
          <div>{{ showForm.colorName }}</div>
        </el-form-item>
        <el-form-item label="规格二参数列表：">
          <div class="spec_bottom">
            <el-tag
              v-for="tag in showForm.colorData"
              v-show="showForm.colorData.length > 0"
              :key="tag"
              type="primary"
            >
              {{tag}}
            </el-tag>
          </div>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--修改界面-->
    <el-dialog
      title="修改"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-row :gutter="24">
        <el-form
          :model="editForm"
          label-width="120px"
          :rules="rulesEdit"
          ref="editForm"
        >
          <el-col :span="12">
            <el-form-item
              label="一级类别"
              prop="firstId"
            >
              <el-select
                placeholder="请选择"
                v-model="firstCategory"
                ref="firstSelect"
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
                v-model="secondCategory"
                :data-oldId="editForm.secondId"
                placeholder="请先选择一级类别"
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
              <el-input v-model="editForm.name"></el-input>
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
                  v-model="editForm.pcnumber[0]"
                  :disabled="true"
                ></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcnumber[1]"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcnumber[2]"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcnumber[3]"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上架天数"
              prop="validTime"
            >
              <el-input v-model="editForm.validTime">
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
                <el-input v-model="editForm.pcprice[0]"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcprice[1]"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcprice[2]"></el-input>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="5">
                <el-input v-model="editForm.pcprice[3]"></el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="规格一名称"
              prop="sizeName"
            >
              <el-input v-model="editForm.sizeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规格一参数"
              prop="sizeStr"
            >
              <el-input v-model="editForm.sizeStr"><template slot="append">
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
                  v-for="tag in editForm.sizeData"
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
              <el-input v-model="editForm.colorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规格二参数"
              prop="colorStr"
            >
              <el-input v-model="editForm.colorStr"><template slot="append">
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
                  v-for="tag in editForm.colorData"
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
                v-model="editForm.status"
                label="1"
              >上架</el-radio>
              <el-radio
                class="radio"
                v-model="editForm.status"
                label="0"
              >下架</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="商品描述"
              prop="standarddcscribe"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 4}"
                placeholder="请输入内容"
                v-model="editForm.standarddcscribe"
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
            v-show="videoOrPhotos == 0"
          >
            <el-form-item label="商品图片">
              <div style="color:#f00;font-weight: 600;">请上传750px * 750px 以上比例商品图片，图片和视频选一即可。</div>
              <el-upload
                :action="uploadServer+'/jade/image/uploadImage.action'"
                list-type="picture-card"
                :on-success="handleSuccess"
                multiple
                :before-upload="beforeUpload"
                :file-list="imgList"
                name="image"
                :on-remove="handleRemove"
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
          <el-col
            :span="24"
            v-show="videoOrPhotos != 0"
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
                :fileList="fileList"
                :before-upload="beforeVideoUpload"
                :on-success="handleSuccessVideo"
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
            v-show="videoOrPhotos != 0"
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
                :on-success="handleSuccess2"
                name="image"
                multiple
                :file-list="imgTextList"
                :on-remove="handleRemove2"
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
      <div
        class="footer"
        style="text-align: center"
      >
        <el-button
          type="primary"
          @click.native="editAction"
        >修改</el-button>
      </div>
      <el-row
        :gutter="24"
        style="padding-bottom: 0px;"
      >
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
import {
  getCommodityList,
  selectCommosityByCid,
  soldOutAndPutAway,
  getFirstCategory,
  getCondition,
  getSecondByFirst,
  delCommodity,
  updataCommodity
} from "api/goods";
import { uploadServer, server } from "api/config";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      totalData: [],
      topics: [],
      total: 0,
      rules: sessionStorage.getItem("rules"),
      rulesEdit: {
        firstId: [
          { required: true, message: "请输入一级类别", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        size: [{ required: true, message: "请输入圈口", trigger: "blur" }],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { min: 1, max: 8, message: "不能超过8位数", trigger: "blur" }
        ],
        water: [{ required: true, message: "请选择种水", trigger: "blur" }],
        color: [{ required: true, message: "请选择颜色", trigger: "blur" }],
        standarddcscribe: [
          { required: true, message: "请输入内容", trigger: "change" }
        ],
        imageText: [
          { required: true, message: "请插入图文", trigger: "change" }
        ]
      },
      roles: {
        firstId: [
          { required: true, message: "请输入一级类别", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        size: [{ required: true, message: "请输入圈口", trigger: "blur" }],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { min: 1, max: 8, message: "不能超过8位数", trigger: "blur" }
        ],
        water: [{ required: true, message: "请选择种水", trigger: "blur" }],
        color: [{ required: true, message: "请选择颜色", trigger: "blur" }],
        standarddcscribe: [
          { required: true, message: "请输入内容", trigger: "change" }
        ],
        imageText: [
          { required: true, message: "请插入图文", trigger: "change" }
        ]
      },
      page: 1,
      pageSize: 10,
      listLoading: false,
      showFormVisible: false, // 查看界面是否显示
      showLoading: false,
      showForm: {
        cid: "",
        name: "",
        price: "",
        sid: "",
        colorName: "",
        colorData: [],
        sizeName: "",
        sizeData: [],
        img: [{ name: "", url: "" }],
        video: { name: "", url: "" }
      },
      editFormVisible: false, // 查看界面是否显示
      editForm: {
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
        status: "0"
      },
      firstCategoryOption: [],
      firstCategory: "",
      sectionCategoryOption: [],
      sectionCategoryOptionFlag: true,
      secondCategory: "",
      videoOrPhotos: "",
      uploadVideoPost: "",
      dialogImageUrl: "",
      dialogVisible: false,
      imgTextList: [],
      uploadServer: uploadServer,
      server: server,
      videoPostUrl: "",
      imgList: [],
      videoUrl: "",
      fileList: [],
      colorOption: []
    };
  },
  methods: {
    // 尺寸
    addSize() {
      let names = String(this.editForm.sizeStr);
      if (!this.editForm.sizeData) {
        this.editForm.sizeData = [];
      }
      if (!this.editForm.sizeData.find(item => item === names)) {
        this.editForm.sizeData.push(names);
      }
      this.editForm.sizeStr = "";
    },
    deleteSize(tag) {
      this.editForm.sizeData.splice(this.editForm.sizeData.indexOf(tag), 1);
    },
    // 颜色
    addColor() {
      let names = String(this.editForm.colorStr);
      if (!this.editForm.colorData) {
        this.editForm.colorData = [];
      }
      if (!this.editForm.colorData.find(item => item === names)) {
        this.editForm.colorData.push(names);
      }
      this.editForm.colorStr = "";
    },
    deleteColor(tag) {
      this.editForm.colorData.splice(this.editForm.colorData.indexOf(tag), 1);
    },
    getTopics() {
      this.listLoading = true;
      getCommodityList().then(res => {
        if (res.success) {
          this.setTopics(res.result.data);
        } else {
          this.$confirm(res.result.error, "提示", {
            type: "warning"
          }).then(() => {
            // do...
          });
        }
        this.listLoading = false;
      });
    },
    setTopics(data) {
      this.totalData = data.reverse();
      this.total = Math.ceil(this.totalData.length / 10);
      this.topics = data.slice(this.page - 1, 10);
    },
    filterData() {
      let ret = [];
      getCommodityList().then(res => {
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
                let tmp = item[val] + "";
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
      this.page = val;
      let ret = [];
      for (let i = (val - 1) * 10; i < 10 * val; i++) {
        if (this.totalData[i]) {
          ret.push(this.totalData[i]);
        }
      }
      this.topics = ret;
    },
    handleOutLine(row) {
      this.$confirm("确认下架吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = JSON.stringify({ cid: row.cid, time: row.validTime });
          soldOutAndPutAway(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "下架成功",
                type: "success"
              });
            } else {
              this.$message.error("下架失败");
            }
            this.handleCurrentChange(1);
            this.getTopics();
          });
        })
        .catch(() => {});
    },
    handleEdit(row) {
      this.listLoading = true;
      this.sectionCategoryOptionFlag = true;
      getFirstCategory({}).then(res => {
        this.firstCategoryOption = res.result.data;
        getCondition().then(res => {
          this.imgList = [];
          this.videoUrl = "";
          this.videoPostUrl = "";
          this.uploadVideoPost = "";
          this.imgTextList = [];
          this.waterOption = res.result.water;
          this.colorOption = res.result.color;
          Object.assign(this.editForm, row, { status: "1" });
          if (row.figuredescribe) {
            row.figuredescribe.map(item => {
              this.imgTextList.push({
                name: item.key,
                url: item.url
              });
            });
          }
          let colorObj = JSON.parse(row.color);
          let sizeObj = JSON.parse(row.size);

          let colorTemp = colorObj.data.split(",");
          this.editForm.colorName = colorObj.name;
          this.editForm.colorData = colorTemp[0] ? colorTemp : [];

          let sizeTemp = sizeObj.data.split(",");
          this.editForm.sizeData = sizeTemp[0] ? sizeTemp : [];
          this.editForm.sizeName = sizeObj.name;

          let pcnumber = this.editForm.price.split("-")[0].split(",");
          let pcprice = this.editForm.price.split("-")[1].split(",");
          this.editForm.pcnumber = pcnumber;
          this.editForm.pcprice = pcprice;
          this.editForm.color = row.color;
          if (row.isNoPackagemaill !== "0") {
            this.videoUrl = row.isNoPackagemaill[0].url;
            this.videoPostUrl = row.isNoPackagemaill[1].url;
            this.editForm.video = row.isNoPackagemaill[0].key;
            this.uploadVideoPost = row.isNoPackagemaill[1].key;
            if (row.commodityImg) {
              row.commodityImg.map(item => {
                this.imgList.push({ name: item.key, url: item.url });
              });
            }
          } else {
            row.commodityImg.map(item => {
              this.imgList.push({ name: item.key, url: item.url });
            });
          }
          this.videoOrPhotos = this.editForm.videoOrPhotos;
          this.firstCategory = this.editForm.firstCategory;
          this.secondCategory = this.editForm.secondCategory || "其它";
          this.fileList = [];
          this.firstCate(this.firstCategory);
          this.editFormVisible = true;
          this.listLoading = false;
        });
      });
    },
    firstCate(val) {
      if (!val) {
        // 如果val为空返回
        return false;
      }
      if (val === this.editForm.firstCategory) {
        // 如果val的值是一文字  就让其变成对应的id
        val = this.editForm.firstId;
      }
      let param = {
        firstId: val
      };
      getSecondByFirst(param).then(res => {
        this.sectionCategoryOption = res.result.data;
        this.sectionCategoryOptionFlag = false;
        if (
          this.sectionCategoryOption[0].name === "其它" ||
          this.sectionCategoryOption[0].name === "其他"
        ) {
          // 没有其他项的话就默认选中其它
          this.secondCategory = this.sectionCategoryOption[0].name;
        } else {
          var flag = false; // 判断是不是在原来的项中
          for (var i = 0; i < this.sectionCategoryOption.length; i++) {
            if (this.secondCategory === this.sectionCategoryOption[i].name) {
              flag = true;
            }
          }
          if (flag) {
            this.secondCategory = this.editForm.secondCategory;
          } else {
            this.secondCategory = this.sectionCategoryOption[0].name;
          }
        }
      });
    }, // 点击一级二级出来
    getFirst() {
      this.listLoading = true;
      getFirstCategory({}).then(res => {
        this.firstCategoryOption = res.result.data;
        this.listLoading = false;
      });
    },
    handleDel(row) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = JSON.stringify({ cid: row.cid });
          delCommodity(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message.error("删除失败");
            }
            this.handleCurrentChange(1);
            this.getTopics();
          });
        })
        .catch(() => {});
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
      if (this.imgList.length > 8) {
        this.$message({
          type: "error",
          message: "最多上传9张图片",
          duration: 1000
        });
        return false;
      }
    },
    handleSuccess(res, file, fileList) {
      this.imgList = fileList;
    },
    handleRemove(file, fileList) {
      this.imgList = fileList;
    },
    handleSuccess2(response, file, fileList) {
      this.imgTextList = fileList;
    }, // 图文描述新增
    handleRemove2(file, fileList) {
      this.imgTextList = fileList;
    },
    // 图文描述删除
    // 提交修改
    editAction() {
      // 视频和图片
      if (this.videoOrPhotos === "1") {
        // 视频
        if (!this.editForm.video) {
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
          this.editForm.video.indexOf(".mp4") > 0
            ? (this.editForm.video = this.editForm.video.slice(0, -4))
            : "";
          this.editForm.isNoPackagemaill =
            this.editForm.video + "," + this.uploadVideoPost;
          let list = [];
          if (this.imgList.length) {
            this.imgList.map(item => {
              if (item.name) {
                list.push(item.name);
              } else {
                if (item.response) {
                  list.push(item.response.result.key);
                }
              }
            });
          }
          this.editForm.commodityImg = list.toString();
        }
      } else {
        // 图片
        //          if (this.imgList.length < 3) {
        //            this.$message({
        //              showClose: true,
        //              message: '请上传至少3张的图片',
        //              type: 'error'
        //            })
        //            return
        //          }
        let commodityImg = [];
        this.imgList.map((item, index) => {
          if (index < 9) {
            if (item.response) {
              commodityImg.push(item.response.result.key);
            } else {
              commodityImg.push(item.name);
            }
          }
        });
        this.editForm.commodityImg = commodityImg.join(",");
        this.editForm.video.indexOf(".mp4") > 0
          ? (this.editForm.video = this.editForm.video.slice(0, -4))
          : "";
        if (!this.uploadVideoPost) {
          if (this.editForm.isNoPackagemaill !== "0") {
            this.editForm.isNoPackagemaill =
              this.editForm.video + "," + this.editForm.video[1].key;
          } else {
            this.editForm.isNoPackagemaill = "0";
          }
        } else {
          this.editForm.isNoPackagemaill =
            this.editForm.video + "," + this.uploadVideoPost;
        }
      }
      let imageText = [];
      this.imgTextList.map((item, index) => {
        if (item.response) {
          imageText.push(item.response.result.key);
        } else {
          imageText.push(item.name);
        }
      }); // 处理文字描述
      this.editForm.figuredescribe = imageText.join(","); // 图片描述图片用,连接
      this.editLoading = true;
      this.editForm.videoOrPhotos = this.videoOrPhotos; // 视频还是图片
      // 处理分类
      this.editForm.firstId =
        this.firstCategory === this.editForm.firstCategory
          ? this.editForm.firstId
          : this.firstCategory;
      if (this.secondCategory === this.sectionCategoryOption[0].name) {
        // 如果是默认选中的二级类别就选中其第一个id
        this.editForm.secondId = this.sectionCategoryOption[0].secondId;
      } else {
        if (this.secondCategory === "其它" || this.secondCategory === "其他") {
          // 如果是其他的话就让它变成id
          this.editForm.secondId = this.sectionCategoryOption[0].secondId;
        } else {
          var flag = false; // 判断是不是在原来的项中
          for (var i = 0; i < this.sectionCategoryOption.length; i++) {
            if (this.secondCategory === this.sectionCategoryOption[i].name) {
              flag = true;
            }
          }
          if (!flag) {
            this.editForm.secondId = this.secondCategory;
          }
        }
      }

      this.editForm.price =
        this.editForm.pcnumber.join(",") +
        "-" +
        this.editForm.pcprice.join(",");
      let params = this.editForm;

      params.size = {
        name: this.editForm.sizeName,
        data: this.editForm.sizeData.join(",")
      };
      params.color = {
        name: this.editForm.colorName,
        data: this.editForm.colorData.join(",")
      };
      let para = JSON.stringify(params);
      updataCommodity(para).then(res => {
        this.editLoading = false;
        if (res.success) {
          this.$message({
            message: "更新成功",
            type: "success"
          });
        } else {
          this.$message.error(res.result.error);
        }
        this.editFormVisible = false;
        this.getTopics();
        this.handleCurrentChange(this.page);
      });
    }, // 提交修改
    beforeVideoUpload(file) {
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
    handleSuccessVideo(response, file) {
      this.videoLoading = false;
      this.videoUrl = file.url;
      this.editForm.video = response.result.key;
      this.editForm.img = "";
    }, // 上传视频完成
    handleImportSuccess(res) {
      if (res.success) {
        this.$message({
          message: "恭喜你 上传成功!!!",
          type: "success"
        });
        this.getTopics();
      } else {
        this.$message.error("上传失败");
      }
      this.importsVisible = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleImportRemove() {},
    handleVideoPostSuccess(res, file) {
      this.uploadVideoPost = res.result.key;
      this.videoPostUrl = file.url;
    }, // 上传videoPost
    // 查看
    handelShow(row) {
      console.log(row);
      this.listLoading = true;
      let params = JSON.stringify({
        cid: row.cid
      });
      selectCommosityByCid(params).then(res => {
        let colorObj = JSON.parse(res.result.color);
        let sizeObj = JSON.parse(res.result.size);

        let colorTemp = colorObj.data.split(",");
        res.result.colorName = colorObj.name;
        res.result.colorData = colorTemp[0] ? colorTemp : [];

        let sizeTemp = sizeObj.data.split(",");
        res.result.sizeData = sizeTemp[0] ? sizeTemp : [];
        res.result.sizeName = sizeObj.name;

        Object.assign(
          this.showForm,
          {
            img: [],
            video: {}
          },
          res.result
        );
        this.showFormVisible = true;
        this.listLoading = false;
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fbfdff;
  position: relative;
  overflow: hidden;
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
