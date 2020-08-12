import { login, getUserInfo } from '../../api/user'
import { setToken, removeToken, getToken } from '../../utils/tokne'

const state = {
  token: '',
  userInfo: {}
}

const actions = {
  login({ commit }, options) {
    return new Promise((resolve, reject) => {
      login(options).then(res => {
        const { data } = res
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }) {
    getToken() && commit('SET_TOKEN', getToken())
    getUserInfo().then(res => {
      commit('SET_USER_INFO', res.data)
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  state,
  actions,
  mutations
}
