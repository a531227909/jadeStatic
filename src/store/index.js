import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import msg from './modules/msg'
import permission from './modules/permission'
import performance from './modules/performance'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    msg,
    performance,
    permission
  },
  getters
})

export default store
