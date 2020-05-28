// 入口
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  state: {
    // 全局loading
    loading: false, // 表格
    buttonLoading: false, // 确认按钮
    exportLoading: false, // 导出按钮
    dialogLoading: false, // 弹框
    loadingFlag: false // 为true时loading不消失，当有多个请求(链式调用)时使用，
  },
  mutations: {
    // 打开指定的loading
    SET_LOADING (state, type) {
      state[type] = true
    },
    // 关闭指定的loading SET_LOADING
    CLOSE_LOADING (state, type) {
      state[type] = false
    },
    // 有多个请求时根据loading type设置
    SET_MULTIPLE_LOADING (state, type) {
      state[type] = true
      state.loadingFlag = true
    },
    SET_ALL_LOADING_FALSE (state) {
      // 用于请求异常拦截
      state.loading = false
      state.buttonLoading = false
      state.dialogLoading = false
      state.exportLoading = false
      state.loadingFlag = false
    }
  },
  getters: {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    id: state => state.user.id,
    name: state => state.user.name,
    routers: state => state.user.routers,
    loading: state => state.loading,
    buttonLoading: state => state.buttonLoading,
    exportLoading: state => state.exportLoading,
    dialogLoading: state => state.dialogLoading,
    loadingFlag: state => state.loadingFlag
  }
})

export default store
