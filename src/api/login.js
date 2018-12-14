import axios from 'axios'
import {server} from './config'

// 登陆
export const requestLogin = params => {
  return axios.post(server + '/jade/user/loginManage.action', params, {
    withCredentials: true,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/json'
    }
  }).then(res => {
    sessionStorage.setItem('rules', res.data.result.data)
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })
}
// 获取相关信息
export const getInfo = params => {
  return axios.post(server + '/jade/user/getUser.action', params, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    let ret = Object.assign(res.data.result, {
      rules: sessionStorage.getItem('rules')
    })
    return Promise.resolve(ret)
  }, err => {
    console.log(err)
  })
}
// 登出
export const logout = params => {
  return axios.post(server + '/jade/user/outManageLogin.action', params, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })
}

// 获取消息
export const selectIdea = params => {
  return axios.post(server + '/jade/uorerManage/selectIdea.action', params, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })
}
