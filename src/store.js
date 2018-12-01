import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingCount: 0,
    profile: {},
    isAuthorized: false
  },
  getters: {
    isLoading (state) {
      return state.loadingCount !== 0
    }
  },
  mutations: {
    START_LOADING (state) {
      state.loadingCount++
    },
    STOP_LOADING (state) {
      state.loadingCount--
    },
    LOAD_PROFILE (state, { data }) {
      state.profile = data
      state.isAuthorized = true
    },
    CLEAN_PROFILE (state, _) {
      state.profile = {}
      state.isAuthorized = false
    }
  },
  actions: {
    startLoading (context, _) {
      context.commit('START_LOADING')
    },
    stopLoading (context, _) {
      context.commit('STOP_LOADING')
    },
    profile (context, _) {
      const promise = axios.get('/designer_api/user/info')
      promise.then(response => {
        context.commit('LOAD_PROFILE', response)
      }).catch(_ => {
        context.commit('CLEAN_PROFILE')
      })
      return promise
    }
  }
})
