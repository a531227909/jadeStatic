webpackJsonp([24],{583:function(e,n,t){function o(e){t(678)}var s=t(41)(t(638),t(706),o,null,null);e.exports=s.exports},638:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(234),s=t(102);n.default={created:function(){var e=this,n=this;t.i(o.a)().then(function(o){e.$store.dispatch("setMsg",o.result.data),new GoEasy({appkey:"BS-08966529f95b4756bed27aed077a1ab2"}).subscribe({channel:t.i(s.a)(),onMessage:function(e){var t=e.content.split("##@@##@@"),o={accountName:t[0],content:t[1],createTime:t[2]};n.$store.dispatch("pushMsg",o)},onSuccess:function(){console.log("Channel订阅成功。")},onFailed:function(e){console.log("Channel订阅失败, 错误编码："+e.code+" 错误信息："+e.content)}})})}}},653:function(e,n,t){n=e.exports=t(566)(!0),n.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"greet.vue",sourceRoot:""}])},678:function(e,n,t){var o=t(653);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);t(567)("1f81995f",o,!0,{})},706:function(e,n){e.exports={render:function(){var e=this,n=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("h1",[e._v("欢迎来到合利鲨后台..")])])}]}}});
//# sourceMappingURL=24.94573759e995cb98be5e.js.map