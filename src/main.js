import Vue from 'vue'

import 'normalize.css/normalize.css' // 默认css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制

import * as filters from './filters' // 全局过滤器

Vue.use(ElementUI)

// 全局自定义指定，用于判断按钮权限（使用时v-has="'update'"）
Vue.directive('has', {
  bind (el, binding, vnode) {
    // 获取按钮权限
    const btnPermissions = vnode.context.$route.meta.buttons.map(item => item.buttonTitle)
    if (btnPermissions.indexOf(binding.value) < 0) {
      vnode.context.$nextTick(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})

// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 开启debug模式
Vue.config.debug = true
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
