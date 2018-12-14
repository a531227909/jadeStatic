import axios from 'axios'
import { server } from './config'
import qs from 'qs'



// 更新优惠券状态
export const updateStatus = params => {
  return axios({
    method: 'post',
    url: server + '/jade/couponManage/updateCouponStatus.action',
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

// 获取优惠券列表
export const getList = params => {
  return axios({
    method: 'post',
    url: server + '/jade/couponManage/getCouponList.action',
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

// 删除优惠券
export const delCoupon = params => {
  return axios({
    method: 'post',
    url: server + '/jade/couponManage/deleteCoupon.action',
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

// 添加优惠券
export const addCoupon = params => {
  return axios({
    method: 'post',
    url: server + '/jade/couponManage/insertCoupon.action',
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
