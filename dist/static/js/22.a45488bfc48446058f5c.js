webpackJsonp([22],{568:function(e,r,t){var n=t(41)(t(623),t(728),null,null,null);e.exports=n.exports},597:function(e,r,t){e.exports={default:t(598),__esModule:!0}},598:function(e,r,t){var n=t(29),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){return o.stringify.apply(o,arguments)}},614:function(e,r,t){"use strict";t.d(r,"b",function(){return u}),t.d(r,"f",function(){return s}),t.d(r,"a",function(){return c}),t.d(r,"d",function(){return d}),t.d(r,"c",function(){return p}),t.d(r,"e",function(){return m});var n=t(76),o=t.n(n),a=t(233),l=t.n(a),i=t(232),u=function(e){return l.a.post(i.a+"/jade/authority/getRoleList.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})},s=function(e){return l.a.post(i.a+"/jade/authority/addUser.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})},c=function(e){return l.a.post(i.a+"/jade/authority/getUserList.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})},d=function(e){return l.a.post(i.a+"/jade/authority/UpdateUser.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})},p=function(e){return l.a.post(i.a+"/jade/authority/DelUser.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})},m=function(e){return l.a.post(i.a+"/jade/authority/getUserPerformance.action",e,{withCredentials:!0,headers:{"Content-Type":"application/json"}}).then(function(e){return o.a.resolve(e.data)},function(e){console.log(e)})}},623:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(597),o=t.n(n),a=t(149),l=t.n(a),i=t(614),u=t(102);r.default={data:function(){return{ruleForm:{account:"",name:"",roleId:"",telephone:"",password:"",idNumber:""},rulesFrom:{account:[{required:!0,message:"请输入账号",trigger:"blur"}],name:[{required:!0,message:"请输入名字",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}],idNumber:[{required:!0,message:"请输入身份证",trigger:"blur"},{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"请输入正确的身份证",trigger:"blur"}],telephone:[{required:!0,message:"请输入手机号码",trigger:"blur"},{pattern:/(^\d{11}$)/,message:"请输入正确的手机号码",trigger:"blur"}]},rules:[],roleOptions:[]}},methods:{handleCreate:function(){var e=this;this.listLoading=!0,this.$refs.ruleForm.validate(function(r){if(r){var n=l()({},e.ruleForm,{sid:t.i(u.a)()});n=o()(n),t.i(i.f)(n).then(function(r){r.success?e.$confirm("新建用户成功..","提示",{type:"success"}).then(function(){e.$router.push("/account/list")}):e.$confirm(r.result.error,"提示",{type:"warning"}).then(function(){e.$router.push("/account/add")})})}e.listLoading=!1})}},created:function(){var e=this;this.listLoading=!0,t.i(i.b)(o()({})).then(function(r){r.success?(r.result.data.unshift({addPerson:"",comment:"这是一个普通用户",createTime:"2017-08-11 16:18:30",reserve1:null,reserve2:null,roleId:"1",roleName:"用户"}),e.roleOptions=r.result.data):e.$confirm(r.result.error,"提示",{type:"warning"}).then(function(){}),e.listLoading=!1})}}},728:function(e,r){e.exports={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm,rules:e.rulesFrom,"label-width":"80px"}},[t("el-form-item",{attrs:{label:"账号",prop:"account"}},[t("el-input",{model:{value:e.ruleForm.account,callback:function(r){e.$set(e.ruleForm,"account",r)},expression:"ruleForm.account"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"名称",prop:"name"}},[t("el-input",{model:{value:e.ruleForm.name,callback:function(r){e.$set(e.ruleForm,"name",r)},expression:"ruleForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"密码",prop:"password"}},[t("el-input",{attrs:{type:"password"},model:{value:e.ruleForm.password,callback:function(r){e.$set(e.ruleForm,"password",r)},expression:"ruleForm.password"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"身份证",prop:"idNumber"}},[t("el-input",{model:{value:e.ruleForm.idNumber,callback:function(r){e.$set(e.ruleForm,"idNumber",r)},expression:"ruleForm.idNumber"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"手机号码",prop:"telephone"}},[t("el-input",{model:{value:e.ruleForm.telephone,callback:function(r){e.$set(e.ruleForm,"telephone",r)},expression:"ruleForm.telephone"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"选择角色",prop:"roleId"}},[t("el-select",{attrs:{placeholder:"请选择"},model:{value:e.ruleForm.roleId,callback:function(r){e.$set(e.ruleForm,"roleId",r)},expression:"ruleForm.roleId"}},e._l(e.roleOptions,function(e){return t("el-option",{key:e.value,attrs:{label:e.roleName,value:e.roleId}})}),1)],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:e.handleCreate}},[e._v("立即创建")])],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=22.a45488bfc48446058f5c.js.map