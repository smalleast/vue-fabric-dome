import axios from 'axios'
import { Message } from 'element-ui'

import VueStore from './store'
import { API_BASE_URL } from '@/constants'

axios.defaults.baseURL = API_BASE_URL

axios.interceptors.request.use(config => {
  VueStore.dispatch('startLoading')
  return config
}, error => {
  VueStore.dispatch('startLoading')
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  VueStore.dispatch('stopLoading')
  switch (response.data.status_code) {
    case 200:
      response.data = response.data.data
      break
    case 400:
      response.status = response.data.status_code
      response.statusText = response.data.message
      Message({
        message: response.statusText,
        type: 'warning'
      })
      return Promise.reject(response)
    default:
      response.status = response.data.status_code
      response.statusText = response.data.message
      if (response.status === 500) {
        Message({
          message: '服务器异常',
          type: 'error'
        })
      }
      return Promise.reject(response)
  }
  return response
}, error => {
  VueStore.dispatch('stopLoading')
  Message({
    message: '网络异常，请稍后重试',
    type: 'error'
  })
  return Promise.reject(error)
})
