import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token
// import getPageTitle from '@/utils/getPageTitle'

NProgress.configure({ showSpinner: false }) // 进度条配置，不显示右上角loading效果

const whiteList = ['/login'] // 不重定向的白名单

router.beforeEach(async (to, from, next) => {
  // 打开进度条
  NProgress.start()

  // 设置页卡title
  // document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登陆
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果是登陆状态，回到欢迎页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 刷新页面重新获取菜单信息
      const hasGetUserInfo = store.getters.id
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          const accessRoutes = await store.dispatch('user/GetUserInfo')
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          // 移除token返回登陆页
          await store.dispatch('user/ResetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单直接访问
      next()
    } else {
      // 其它页没有权限时返回登陆页，登陆成功回到上个页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
