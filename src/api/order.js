import axios from 'axios'
import {server} from './config'

// 查看某代理商的所有订单
export const getMyAllUOrder = params => {
  return axios.post(server + '/jade/uorerManage/getMyAllUOrder.action', params, {
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

// 退单
export const returnedUOrder = params => {
  return axios.post(server + '/jade/uorerManage/returnedUOrder.action', params, {
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

// 获取订单详情
export const checkComAndRec = params => {
  return axios.post(server + '/jade/uorerManage/checkComAndRec.action', params, {
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

// 发货
export const changeUOrderType = params => {
  return axios.post(server + '/jade/uorerManage/changeUOrderType.action', params, {
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

// 获取评价信息
export const selectEvaluate = params => {
  console.log(params)
  return axios.post(server + '/jade/evaluate/selectEvaluate.action', params, {
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
    }
  }).then(res => {
    return Promise.resolve(res.data)
  }, err => {
    console.log(err)
  })
}

// 恢复订单
export const restoreUOrder = params => {
  console.log(params)
  return axios.post(server + '/jade/uorerManage/restoreUOrder.action', params, {
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

