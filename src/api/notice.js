import axios from 'axios'
import {server} from './config'

// 获取公共列表
export const getNoticeList = () => {
  return axios.post(server + '/jade/notice/getNoticeList.action', {}, {
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

// 浏览公告
export const browse = params => {
  return axios.post(server + '/jade/notice/browse.action', params, {
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
// 上线/下线
export const isONLine = params => {
  return axios.post(server + '/jade/notice/isONLine.action', params, {
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
// 删除
export const delNotice = params => {
  return axios.post(server + '/jade/notice/delNotice.action', params, {
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

// 新增公告
export const addNotice = params => {
  return axios.post(server + '/jade/notice/addNotice.action', params, {
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
