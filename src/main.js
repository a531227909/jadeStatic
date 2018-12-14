import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router/index'
import ElementUI from 'element-ui'
import 'common/stylus/reset.styl'
import 'element-ui/lib/theme-default/index.css'
import { getToken } from '@/utils/auth'

Vue.use(ElementUI)
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (store.getters.roles && store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => {
          if (!res.rules) {
            next('/login')
          } else {
            const roles = res.rules.split(',')
            store.dispatch('GenerateRoutes', {roles}).then(() => {
              router.addRoutes(store.getters.addRouters)
              next({...to})
            })
          }
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
