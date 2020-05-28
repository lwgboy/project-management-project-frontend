// 设置token,登陆，退出，获取用户信息等用户相关操作
import { login, getUserInfoById, loginOut } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getAccount, removeAccount, setAccount } from '@/utils/storage'
import router, { resetRouter, lastRoutes } from '@/router'
import Layout from '@/layout/Layout'

// 初始化
const state = {
  token: getToken(), // 请求头里边传给后端
  account: getAccount(), // 获取用户菜单信息时的参数
  id: '',
  name: '',
  routers: router
}

// 同步（修改）
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if (!token) { // token为''就删除token
      removeToken()
    } else { // token有值就设置token
      setToken(token)
    }
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
    if (!account) { // id为''就删除id
      removeAccount()
    } else { // id有值就设置id
      setAccount(account)
    }
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROUTERS: (state, routers) => {
    // 将欢迎页加到router里边
    const welcome = {
      path: '/welcome',
      name: 'welcome',
      meta: { title: '欢迎页', icon: 'welcome' }
    }
    state.routers = [welcome].concat(routers)
  }
}

// 异步（修改）
const actions = {
  Login ({ commit }, params) {
    return new Promise((resolve, reject) => {
      login(params).then(res => {
        const { token, account } = res
        commit('SET_TOKEN', token)
        commit('SET_ACCOUNT', account)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  GetUserInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfoById(state.account).then(res => {
        const { userName, menus, id } = res
        commit('SET_NAME', userName)
        commit('SET_ID', id)
        const asyncRoutes = []
        // 动态加载菜单组件,暂时只有两级菜单，一级菜单没有按钮权限，二级菜单才有按钮权限
        menus.forEach(menu => {
          const asyncRoutesItem = {
            path: menu.menuPath,
            name: menu.menuPath.replace('/', ''),
            component: Layout,
            redirect: 'noRedirect', // 一级页面菜单不让页面跳转
            meta: { title: menu.menuTitle, icon: menu.menuIcon }
          }
          asyncRoutesItem.children = []
          menu.children.forEach(subMenu => {
            const path = subMenu.menuPath.replace(menu.menuPath, '').replace('/', '')
            const asyncRoutesChildrenItem = {
              path: path,
              name: path,
              component: (resolve) => require([`../../views${subMenu.menuPath}.vue`], resolve),
              meta: {
                title: subMenu.menuTitle,
                icon: subMenu.menuIcon,
                buttons: subMenu.buttons
              }
            }
            asyncRoutesItem.children.push(asyncRoutesChildrenItem)
          })
          asyncRoutes.push(asyncRoutesItem)
        })
        // 将404页面放到路由最后加载，这样无法匹配到的路由全走404页面
        const routers = asyncRoutes.concat(lastRoutes)
        commit('SET_ROUTERS', routers)
        resolve(routers)
      }).catch(error => {
        reject(error)
      })
    })
  },
  Logout ({ commit }) {
    return new Promise((resolve, reject) => {
      loginOut().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ID', '')
        commit('SET_ACCOUNT', '')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  ResetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ACCOUNT', '')
      commit('SET_ID', '')
      resolve()
    })
  }
}

// 导出
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

