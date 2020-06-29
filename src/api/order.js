import request from '@/utils/request'

// 查询全部订单
export function findOrderByPageAndCondition (data) {
  return request({
    url: '/v1/orders/v1/conditions',
    method: 'post',
    data
  })
}

// 创建订单
export function createOrder (data) {
  return request({
    url: '/v1/orders/v1',
    method: 'post',
    data
  })
}

// 修改订单
export function updateOrder (data) {
  return request({
    url: '/v1/orders/v1',
    method: 'put',
    data
  })
}

// 根据主键删除订单
export function deleteOrder (id) {
  return request({
    url: '/v1/orders/v1/' + id,
    method: 'delete'
  })
}

// 提交订单
export function submitOrder (id) {
  return request({
    url: '/v1/orders/v1/' + id + '/submit',
    method: 'put'
  })
}

// 查询全部订单
export function findAllOrder () {
  return request({
    url: '/v1/orders/v1',
    method: 'get'
  })
}

export function findOrderByCode (code) {
  return request({
    url: '/v1/orders/v1/code/' + code,
    method: 'get'
  })
}

export function exportOrder (data) {
  return request({
    url: '/v1/orders/v1/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function findOrderImageById (id) {
  return request({
    url: '/v1/orders/v1/' + id + '/images',
    method: 'get'
  })
}

export function uploadOrderImages (id, data) {
  return request({
    url: '/v1/orders/v1/' + id + '/images',
    method: 'post',
    data
  })
}

export function removeOrderImages (id) {
  return request({
    url: '/v1/orders/v1/' + id + '/images',
    method: 'delete'
  })
}

export function findOrderImageByCode (code) {
  return request({
    url: '/v1/orders/v1/codes/' + code + '/images',
    method: 'get'
  })
}
