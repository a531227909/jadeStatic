import { requestLogin, logout, getInfo } from 'api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({commit}, userInfo) {
      const account = userInfo.account
      const password = userInfo.checkPass
      return new Promise((resolve, reject) => {
        let params = {
          account: account,
          password: password
        }
        requestLogin(params).then(response => {
          const data = response.result
          setToken(data.sid)
          sessionStorage.setItem('accountType', data.accountType)
          commit('SET_TOKEN', data.sid)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({commit}) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response
          commit('SET_ROLES', data.rules)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.img)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
