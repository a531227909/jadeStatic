import axios from 'axios'
import { server } from './config'
import qs from 'qs'


// 获取用户订单列表
export const getList = params => {
  return axios({
    method: 'post',
    url: server + '/jade/OrderStatistics/selectOrderByDate.action',
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
