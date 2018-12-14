import axios from 'axios'
import { server } from './config'
import qs from 'qs'



// 客服根据用户账号查询所有用户聊天信息
export const getCustomerService = params => {
  return axios({
    method: 'post',
    url: server + '/jade/customerService/getCustomerService.action',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true,
    data: qs.stringify(params)
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })

}

// 管理员获取客服列表
export const selectLastByAccount = params => {
  return axios({
    method: 'post',
    url: server + '/jade/customerService/selectLastByAccount.action',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true,
    data: qs.stringify(params)
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })
}



// 添加客服回复信息
export const replyCustomerService = params => {
  return axios({
    method: 'post',
    url: server + '/jade/customerService/replyCustomerService.action',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true,
    data: qs.stringify(params)
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })

}
