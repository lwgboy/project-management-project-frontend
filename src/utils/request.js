import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getHeaders } from '@/utils/headers'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的BASE_URL
  withCredentials: true // 允许携带cookie
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers = getHeaders()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(

  response => {
    // 导出/下载 文件
    // const headers = response.headers
    // if (headers['content-type'] === 'application/octet-stream;charset=utf-8') {
    //   store.commit('CLOSE_LOADING', 'exportLoading')
    //   return response.data
    // }

    const res = response.data
    const code = res.code
    const desc = res.desc
    const msg = res.msg
    // 接口正常返回
    if (code === 20000) {
      if (!store.getters.loadingFlag) { // 用来控制多个请求loading是否显示的问题
        store.commit('SET_ALL_LOADING_FALSE')
      }
      return res.data
    }

    // 接口异常
    if (code === 30000) { // token过期，超时
      store.dispatch('user/ResetToken').then(() => {
        location.reload()
      })
    } else {
      Message({
        message: !msg ? desc : msg,
        type: 'error'
      })
    }
    store.commit('SET_ALL_LOADING_FALSE')
    return Promise.reject(new Error('接口返回异常'))
  },
  error => {
    Message({
      message: '超时或者服务器异常，请稍后再试。',
      type: 'error'
    })
    store.commit('SET_ALL_LOADING_FALSE')
    return Promise.reject(error)
  }
)

export default service
