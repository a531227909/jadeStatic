const msg = {
  state: {
    messages: [],
    oldMsgLength: ''
  },
  mutations: {
    ADD_MSG: (state, msg) => {
      state.messages.push(msg)
    },
    SET_MSG: (state, msg) => {
      if (state.oldMsgLength === '') {
        if (msg) {
          state.oldMsgLength = msg.length || 0
        } else {
          state.oldMsgLength = 0
        }
      }
      state.messages = msg
    },
    CLEAR_MSG: (state, msg) => {
      state.oldMsgLength = 0
      state.messages = []
    }
  },
  actions: {
    // 添加信息
    pushMsg ({commit}, msg) {
      commit('ADD_MSG', msg)
    },
    setMsg ({commit}, msg) {
      commit('SET_MSG', msg)
    },
    clearMsg ({commit}, msg) {
      commit('CLEAR_MSG', msg)
    }
  }
}

export default msg
