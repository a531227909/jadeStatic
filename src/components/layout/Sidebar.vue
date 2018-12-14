<template>
  <el-menu mode="vertical" :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: {SidebarItem},
    computed: {
      ...mapGetters([
        'permission_routers'
      ])
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  .el-menu
    min-height: 100%


</style>
