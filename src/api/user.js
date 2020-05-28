import request from '@/utils/request'

// 登录
export function login (data) {
  return request({
    url: '/signin?userAccount=' + data.userAccount + '&userSecret=' + data.userSecret,
    method: 'post'
  })
}

// 根据id获取菜单信息
export function getUserInfoById (data) {
  return request({
    url: '/v1/users/v1/account/' + data,
    method: 'get'
  })
}

// 登出
export function loginOut () {
  return request({
    url: '/signout',
    method: 'post'
  })
}

// 修改密码
export function updatePassword (data) {
  return request({
    url: '/v1/users/v1/secret',
    method: 'put',
    data
  })
}
