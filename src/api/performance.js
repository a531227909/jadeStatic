import axios from 'axios'
import {server} from './config'

// 根据sid查询业绩
export const agentPerformance = params => {
  return axios.post(server + '/jade/agent/agentPerformance.action', params, {
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

// 清空业绩  入参 sid：代理商ID；beginTime：开始时间（选）；endTime：结束时间（选）
export const delagentPerformance = params => {
  return axios.post(server + '/jade/agent/delagentPerformance.action', params, {
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
