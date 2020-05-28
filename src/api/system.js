import request from '@/utils/request'

// 添加用户
export function addUser (data) {
  return request({
    url: '/v1/users/v1',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser (data) {
  return request({
    url: '/v1/users/v1',
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser (data) {
  return request({
    url: '/v1/users/v1/' + data,
    method: 'delete'
  })
}

// 用户分页
export function getUserPageList (data) {
  return request({
    url: '/v1/users/v1/conditions',
    method: 'post',
    data
  })
}

// 判断用户是否存在
export function isExistedUser (data) {
  return request({
    url: '/v1/users/v1/exists/account',
    method: 'post',
    data
  })
}

// 判断用户手机是否存在
export function isExistedPhone (data) {
  return request({
    url: '/v1/users/v1/exists/phone',
    method: 'post',
    data
  })
}

// 判断用户又想是否存在
export function isExistedEmail (data) {
  return request({
    url: '/v1/users/v1/exists/email',
    method: 'post',
    data
  })
}

// 批量删除用户
export function batchDeleteUser (data) {
  return request({
    url: '/v1/users/v1',
    method: 'delete',
    data
  })
}

// 重置密码
export function resetPassword (data) {
  return request({
    url: '/v1/users/v1/' + data + '/secret/reset',
    method: 'put'
  })
}

// 获取所有用户
export function getAllUserList () {
  return request({
    url: '/v1/users/v1',
    method: 'get'
  })
}

// 获取所有菜单
export function getAllMenuList () {
  return request({
    url: '/v1/menus/v1',
    method: 'get'
  })
}

// 添加菜单
export function addMenu (data) {
  return request({
    url: '/v1/menus/v1',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu (data) {
  return request({
    url: '/v1/menus/v1',
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu (data) {
  return request({
    url: '/v1/menus/v1/' + data,
    method: 'delete'
  })
}

// 根据菜单ID查询按钮列表
export function getButtonListByMenuId (data) {
  return request({
    url: '/v1/buttons/v1/menus/' + data,
    method: 'get'
  })
}

// 添加按钮
export function addButton (data) {
  return request({
    url: '/v1/buttons/v1',
    method: 'post',
    data
  })
}

// 更新按钮
export function updateButton (data) {
  return request({
    url: '/v1/buttons/v1',
    method: 'put',
    data
  })
}

// 删除按钮
export function deleteButton (data) {
  return request({
    url: '/v1/buttons/v1/' + data,
    method: 'delete'
  })
}

// 添加角色
export function addRole (data) {
  return request({
    url: '/v1/roles/v1',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole (data) {
  return request({
    url: '/v1/roles/v1',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole (data) {
  return request({
    url: '/v1/roles/v1/' + data,
    method: 'delete'
  })
}

// 角色分页
export function getRolePageList (data) {
  return request({
    url: '/v1/roles/v1/conditions',
    method: 'post',
    data
  })
}

// 角色列表不分页
export function getRoleList () {
  return request({
    url: '/v1/roles/v1',
    method: 'get'
  })
}

// 批量删除角色
export function batchDeleteRole (data) {
  return request({
    url: '/v1/roles/v1/batch',
    method: 'delete',
    data
  })
}

// 根据角色ID查询用户列表
export function getRoleUserListById (data) {
  return request({
    url: '/v1/roles/v1/' + data + '/users',
    method: 'get'
  })
}

// 根据角色ID查询菜单列表
export function getRoleMenuListById (data) {
  return request({
    url: '/v1/roles/v1/' + data + '/functions',
    method: 'get'
  })
}

// 批量添加角色用户关系
export function updateRoleUser (data) {
  return request({
    url: '/v1/roles/v1/save-role-user',
    method: 'put',
    data
  })
}

// 批量添加角色菜单关系
export function updateRoleMenu (data) {
  return request({
    url: '/v1/roles/v1/save-role-function',
    method: 'put',
    data
  })
}

// 判断角色英文名称是否存在
export function isExistedRoleCode (data) {
  return request({
    url: '/v1/roles/v1/exists/code',
    method: 'post',
    data
  })
}

// 判断角色中文名称是否存在
export function isExistedRoleName (data) {
  return request({
    url: '/v1/roles/v1/exists/name',
    method: 'post',
    data
  })
}

// 保存角色与API的鉴权关系
export function saveApi (data) {
  return request({
    url: '/v1/roles/v1/' + data.roleId + '/save-role-api',
    method: 'put',
    data: data.apis
  })
}

// 查询角色与API的鉴权关系
export function findApi (data) {
  return request({
    url: '/v1/roles/v1/' + data + '/apis',
    method: 'get'
  })
}

// 操作日志分页
export function getLogPageList (data) {
  return request({
    url: '/v1/operation-logs/v1/conditions',
    method: 'post',
    data
  })
}

// 根据ID查询操作日志详情
export function getLogById (data) {
  return request({
    url: '/v1/operation-logs/v1/' + data + '/content',
    method: 'get'
  })
}
