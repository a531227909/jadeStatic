const performance = {
  state: {
    id: ''
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    }
  },
  actions: {
    setSid ({commit}, sid) {
      return new Promise((resolve, reject) => {
        commit('SET_ID', sid)
        resolve()
      })
    }
  }
}

export default performance
