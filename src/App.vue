<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="stylus">
  #app
    position: absolute
    top: 0px
    bottom: 0px
    width: 100%

  .toolbar
    background: #f2f2f2
    padding: 10px
    margin: 10px 0px
    .el-form-item
      margin-bottom: 10px

  .fade-enter-active,
  .fade-leave-active
    transition: all .2s ease

  .fade-enter,
  .fade-leave-active
    opacity: 0

</style>

