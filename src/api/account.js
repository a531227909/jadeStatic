import axios from 'axios'
import {server} from './config'

// 获取角色列表
export const getRoleList = params => {
  return axios.post(server + '/jade/authority/getRoleList.action', params, {
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

// 添加用户
export const addUser = params => {
  return axios.post(server + '/jade/authority/addUser.action', params, {
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

// 获取用户
export const getUserList = params => {
  return axios.post(server + '/jade/authority/getUserList.action', params, {
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

// 修改用户
export const UpdateUser = params => {
  return axios.post(server + '/jade/authority/UpdateUser.action', params, {
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
// 删除用户
export const DelUser = params => {
  return axios.post(server + '/jade/authority/DelUser.action', params, {
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

// 获取用户业绩
export const getUserPerformance = params => {
  return axios.post(server + '/jade/authority/getUserPerformance.action', params, {
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
