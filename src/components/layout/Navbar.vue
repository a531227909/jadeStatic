<template>
  <el-col :span="24" class="header">
    <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
      {{collapsed ? '' : sysName}}
    </el-col>
    <el-col :span="4" class="userinfo" style="position: relative">
      <el-badge :value="msgs" style="position: relative;right:24px;">
        <img src="/static/lingdang.png" alt="" @click="show" style="position: relative;top: 6px;">
      </el-badge>
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner">
          <img :src="this.sysUserAvatar"/>{{sysUserName}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link class='inlineBlock' to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided><span @click="logout" style="display:block;">登出</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-dialog
      title="信息"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      size="small" class="msgs">
      <el-table
        :data="topics"
        style="width: 100%">
        <el-table-column
          prop="accountName"
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="content"
          align="center"
          label="内容">
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime.slice(0, 11)}}
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar" style="line-height: 30px;" v-show="total > 0">
        <el-pagination layout="prev, pager, next"
                       @current-change="handleCurrentChange"
                       :page-size="pageSize"
                       :total="total * pageSize"
                       style="float:right;">
        </el-pagination>
      </el-col>

    </el-dialog>
  </el-col>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Levelbar from './Levelbar'

  export default {
    props: ['sysName', 'collapsed'],
    data () {
      return {
        dialogVisible: false,
        totalData: [],
        topics: [],
        page: 1,
        total: 0,
        pageSize: 12
      }
    },
    components: {
      Levelbar
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'name'
      ]),
      sysUserAvatar () {
        return this.avatar
      },
      sysUserName () {
        return this.name || '未定义'
      },
      msgs () {
        let data
        if (!this.$store.state.msg.messages) {
          data = []
          this.setTopics(data)
          return 0
        } else {
          data = this.$store.state.msg.messages
          this.setTopics(data)
          return (this.$store.state.msg.messages.length - this.$store.state.msg.oldMsgLength)
        }
      }
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('ToggleSideBar')
      },
      setTopics (data) {
        this.totalData = data
        this.total = Math.ceil(this.totalData.length / this.pageSize)
        this.topics = data.slice(this.page - 1, 10)
      },
      handleCurrentChange (val) {
        this.page = val
        let ret = []
        for (let i = (val - 1) * this.pageSize; i < this.pageSize * val; i++) {
          if (this.totalData[i]) {
            ret.push(this.totalData[i])
          }
        }
        this.topics = ret
      },
      logout () {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()  // 为了重新实例化vue-router对象 避免bug
        })
      },
      show () {
        this.setTopics(this.$store.state.msg.messages.reverse())
        this.dialogVisible = true
      },
      handleClose () {
        this.$store.dispatch('clearMsg')
        this.dialogVisible = false
      }
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  el-form-item
    line-height: 60px

  .demo-table-expand
    font-size: 0

  .demo-table-expand label
    width: 90px
    color: #99a9bf

  .demo-table-expand .el-form-item
    margin-right: 0
    margin-bottom: 0
    width: 50%

  .msgs
    text-align: left

  .userinfo
    text-align: right
    padding-right: 35px
    float: right
    .userinfo-inner
      cursor: pointer
      color: #fff
      img
        width: 40px
        height: 40px
        border-radius: 20px
        margin: 20px 10px
        float: right

  .logo
    height: 80px
    font-size: 22px
    padding-left: 20px
    padding-right: 20px
    border-color: rgba(238, 241, 146, 0.3)
    border-right-width: 1px
    border-right-style: solid
    img
      width: 40px
      float: left
    .txt
      color: #fff

  .logo-width
    width: 230px

  .logo-collapse-width
    width: 60 p

  .tools
    padding: 0px 23px
    width: 14px
    height: 60px
    line-height: 60px
    cursor: pointer
</style>



