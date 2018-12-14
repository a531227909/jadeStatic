<template>
  <span class='orange'>{{time}}</span>
</template>
<script>
  export default{
    data () {
      return {
        now: 0
      }
    },
    props: ['endtime'],
    methods: {
      formate (time) {
        let hour = parseInt(time / 1000 / 3600)
        let min = parseInt((time / 1000 - hour * 3600) / 60)
        let sec = parseInt(time / 1000 - hour * 3600 - min * 60)
        if (min < 0) {
          return '倒计时结束'
        } else {
          if (hour > 24) {
            return ((hour / 24) | 0) + '天' + min + '分' + sec + '秒'
          }
          return min + '分' + sec + '秒'
        }
      }
    },
    computed: {
      'time': function () {
        return this.formate(new Date(this.endtime).getTime() - this.now)
      }
    },
    created () {
      let self = this
      self.now = new Date().getTime()
      setInterval(function () {
        self.now = new Date().getTime()
      }, 1000)
    }
  }
</script>
<style>
  .orange {
    color: orange;
  }
</style>
