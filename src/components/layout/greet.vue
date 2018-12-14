<template>
  <div>
    <h1>欢迎来到合利鲨后台..</h1>
  </div>
</template>
<script type="text/ecmascript-6">
import { selectIdea } from 'api/login';
import { getToken } from '@/utils/auth';

export default {
  created() {
    let that = this;

    selectIdea().then(res => {
      this.$store.dispatch('setMsg', res.result.data);
      let goEasy = new GoEasy({
        appkey: 'BS-08966529f95b4756bed27aed077a1ab2'
      });
      goEasy.subscribe({
        channel: getToken(),
        onMessage: function(message) {
          let msg = message.content.split('##@@##@@');
          let obj = {
            accountName: msg[0],
            content: msg[1],
            createTime: msg[2]
          };

          that.$store.dispatch('pushMsg', obj);
        },
        onSuccess: function() {
          console.log('Channel订阅成功。');
        },
        onFailed: function(error) {
          console.log('Channel订阅失败, 错误编码：' + error.code + ' 错误信息：' + error.content);
        }
      });
    });
  }
};
</script>
<style slot-scoped lang="stylus" rel="stylesheet/stylus">
</style>
