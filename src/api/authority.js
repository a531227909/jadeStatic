import axios from 'axios'
import {server} from './config'

// 查询所有代理商
export const selectAgent = () => {
  return axios.post(server + '/jade/agent/selectAgent.action', {}, {
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
// 根据sid查询所有代理商用户
export const getAgentBySid = params => {
  return axios.post(server + '/jade/agent/getAgentBySid.action', params, {
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
// 根据sid设置代理商用户数量
export const setUserNumber = params => {
  return axios.post(server + '/jade/agent/setUserNumber.action', params, {
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
// 根据sid注销代理商(同时将账号，商品下架)
export const cancelAgent = params => {
  return axios.post(server + '/jade/agent/cancelAgent.action', params, {
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
// 根据sid激活代理商(同时将账号激活，商品需手动上架)
export const activationAgent = params => {
  return axios.post(server + '/jade/agent/activationAgent.action', params, {
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
// 根据sid删除代理商(同时将账号，商品删除，代理商需先注销才可删除)
export const delAgent = params => {
  return axios.post(server + '/jade/agent/delAgent.action', params, {
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
// 根据sid查询所有代理商用户
export const getUserMessage = params => {
  return axios.post(server + '/jade/agent/getUserMessage.action', params, {
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
// 添加代理商
export const addAgent = params => {
  return axios.post(server + '/jade/agent/addAgent.action', params, {
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
// 更新代理商
export const updateAgent = params => {
  return axios.post(server + '/jade/agent/updateAgent.action', params, {
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

// 获取所有权限
export const getAllAuthority = params => {
  return axios.post(server + '/jade/authority/getAllAuthority.action', params, {
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

// 添加角色
export const addRole = params => {
  return axios.post(server + '/jade/authority/addRole.action', params, {
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
// 更新角色
export const updateRole = params => {
  return axios.post(server + '/jade/authority/updateRole.action', params, {
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

export const delRole = params => {
  return axios.post(server + '/jade/authority/delRole.action', params, {
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

export const getRoleAuthority = params => {
  return axios.post(server + '/jade/authority/getRoleAuthority.action', params, {
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

export const authorityOfDistribution = params => {
  return axios.post(server + '/jade/authority/authorityOfDistribution.action', params, {
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

// 添加代理商账号
export const addAgentAccount = params => {
  return axios.post(server + '/jade/agent/addAgentAccount.action', params, {
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
export const delUser = params => {
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
