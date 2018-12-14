import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

import Layout from 'components/layout/Layout'

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/Layout',
    name: '首页',
    hidden: true,
    children: [{ path: 'Layout', component: _import('layout/greet'), hidden: 'true' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/order',
    component: Layout,
    name: '订单管理',
    redirect: '/order/send',
    iconCls: 'el-icon-message',
    meta: { role: ['0101'] },
    children: [
      { path: 'send', component: _import('order/send'), name: '等待发货', meta: { role: ['010101'] } },
      { path: 'delivery', component: _import('order/delivery'), name: '等待收货', meta: { role: ['010102'] } },
      { path: 'trade', component: _import('order/trade'), name: '交易完成', meta: { role: ['010103'] } },
      { path: 'comment', component: _import('order/comment'), name: '完成评价', meta: { role: ['010104'] } },
      { path: 'close', component: _import('order/close'), name: '自动关闭', meta: { role: ['010105'] } }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: '商品管理',
    iconCls: 'fa fa-address-card',
    meta: { role: ['0102'] },
    children: [
      { path: 'list', component: _import('goods/list'), name: '上架列表', meta: { role: ['010201'] } },
      { path: 'store', component: _import('goods/store'), name: '仓库列表', meta: { role: ['010202'] } },
      { path: 'add', component: _import('goods/add'), name: '新增商品', meta: { role: ['010202'] } },
      { path: 'category', component: _import('goods/category'), name: '类别设置', meta: { role: ['010202'] } }
    ]
  },
  {
    path: '/account',
    component: Layout,
    name: '账号管理',
    iconCls: 'fa fa-address-card',
    meta: { role: ['0103'] },
    children: [
      { path: 'list', component: _import('account/list'), name: '账号列表', meta: { role: ['010301'] } },
      { path: 'add', component: _import('account/add'), name: '添加账号', meta: { role: ['010302'] } }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    name: '公告管理',
    iconCls: 'el-icon-message',
    redirect: '/notice/list',
    meta: { role: ['0104'] },
    children: [
      { path: 'list', component: _import('notice/list'), name: '公告列表', meta: { role: ['010401'] } },
      { path: 'add', component: _import('notice/add'), name: '新建公告', meta: { role: ['010402'] } }
    ]
  },
  {
    path: '/performance',
    component: Layout,
    name: '业绩管理',
    redirect: '/performance/list',
    iconCls: 'el-icon-message',
    meta: { role: ['0105'] },
    noDropdown: true,
    children: [
      { path: 'list', component: _import('performance/list'), name: '业绩管理', meta: { role: ['0105'] } }
    ]
  },
  {
    path: '/rule',
    component: Layout,
    name: '权限管理',
    iconCls: 'el-icon-message',
    redirect: '/rule/list',
    meta: { role: ['0106'] },
    children: [
      { path: 'list', component: _import('rule/list'), name: '角色列表', meta: { role: ['010601'] } },
      { path: 'add', component: _import('rule/add'), name: '添加角色', meta: { role: ['010602'] } }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    name: '代理管理',
    iconCls: 'el-icon-message',
    redirect: '/agent/list',
    meta: { role: ['0107'] },
    children: [
      { path: 'list', component: _import('agent/list'), name: '代理商列表', meta: { role: ['010701'] } },
      { path: 'add', component: _import('agent/add'), name: '添加代理', meta: { role: ['010702'] } },
      { path: ':id', component: _import('agent/detail'), name: '代理商业绩', hidden: true, meta: { role: ['010703'] } }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    name: '客服管理',
    iconCls: 'el-icon-message',
    redirect: '/customer/list',
    meta: { role: ['0103'] },
    children: [
      { path: 'list', component: _import('customer/list'), name: '客服列表', meta: { role: ['010301'] } },
      // { path: 'add', component: _import('customer/add'), name: '添加客服回复信息', meta: { role: ['010301'] } },
      // { path: 'message', component: _import('customer/message'), name: '查询用户聊天信息', meta: { role: ['010301'] } }
    ]
  },
  {
    path: '/coupon',
    component: Layout,
    name: '优惠券管理',
    iconCls: 'el-icon-message',
    redirect: '/coupon/list',
    meta: { role: ['0103'] },
    children: [
      { path: 'list', component: _import('coupon/list'), name: '优惠券列表', meta: { role: ['010301'] } },
      { path: 'add', component: _import('coupon/add'), name: '新增优惠券', meta: { role: ['010301'] } }
    ]
  },
  {
    path: '/cencus',
    component: Layout,
    name: '销售统计',
    iconCls: 'el-icon-message',
    redirect: '/cencus/amount',
    meta: { role: ['0103'] },
    children: [
      { path: 'amount', component: _import('cencus/amount'), name: '统计销售额', meta: { role: ['010301'] } }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
