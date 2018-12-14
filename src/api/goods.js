import axios from 'axios'
import {server} from './config'

// 根据cid等获取商品详细信息
export const selectCommosityByCid = params => {
  return axios.post(server + '/jade/commodityManage/selectCommosityByCid.action', params, {
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
// 获取商品上架列表
export const getCommodityList = () => {
  return axios.post(server + '/jade/commodityManage/getCommodityList.action', {}, {
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

// 获取商品下架列表
export const getCommoditysoldOut = () => {
  return axios.post(server + '/jade/commodityManage/getCommoditysoldOut.action', {}, {
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

// 上架和下架
export const soldOutAndPutAway = params => {
  return axios.post(server + '/jade/commodityManage/soldOutAndPutAway.action', params, {
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
export const delCommodity = params => {
  return axios.post(server + '/jade/commodityManage/delCommodity.action', params, {
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

// 根据一级类别获取二级
export const getSecondByFirst = params => {
  return axios.post(server + '/jade/commodityManage/getSecondByFirst.action', params, {
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

// 新增类别
export const addCategory = params => {
  return axios.post(server + '/jade/commodityManage/addCategory.action', params, {
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
// 新增二级类别
export const addSecondCategory = params => {
  return axios.post(server + '/jade/commodityManage/addSecondCategory.action', params, {
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

// 获取一级类别
export const getFirstCategory = params => {
  return axios.post(server + '/jade/commodityManage/getFirstCategory.action', params, {
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

// 删除类别
export const delCategory = params => {
  return axios.post(server + '/jade/commodityManage/delCategory.action', params, {
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
// 删除二级类别
export const delSecondCategory = params => {
  return axios.post(server + '/jade/commodityManage/delSecondCategory.action', params, {
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
// 获取所有二级类别
export const getAllSecondCategory = params => {
  return axios.post(server + '/jade/commodityManage/getAllSecondCategory.action', params, {
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
// 获取所有二级类别
export const addSecondByFirst = params => {
  return axios.post(server + '/jade/commodityManage/addSecondByFirst.action', params, {
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
// 修改二级类别
export const updateSecond = params => {
  return axios.post(server + '/jade/commodityManage/updateSecond.action', params, {
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

// 添加商品
export const addCommodity = params => {
  return axios.post(server + '/jade/commodityManage/addCommodity.action', params, {
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

// 获取颜色，种水，价格
export const getCondition = params => {
  return axios.post(server + '/jade/commodity/getCondition.action', params, {
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

// 更新商品
export const updataCommodity = params => {
  return axios.post(server + '/jade/commodityManage/updataCommodity.action', params, {
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

// 更新商品
export const updateCategory = params => {
  return axios.post(server + '/jade/commodityManage/updateCategory.action', params, {
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
// 更新商品
export const saveDoc = params => {
  return axios.post(server + '/jade/commodityManage/saveDoc.action', params, {
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
