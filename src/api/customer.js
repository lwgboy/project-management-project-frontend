import request from '@/utils/request'

// 查询全部客户
export function findAllCustomer () {
  return request({
    url: '/v1/customers/v1',
    method: 'get'
  })
}

export function createCustomer (data) {
  return request({
    url: '/v1/customers/v1',
    method: 'post',
    data
  })
}

export function updateCustomer (data) {
  return request({
    url: '/v1/customers/v1',
    method: 'put',
    data
  })
}

export function deleteCustomer (id) {
  return request({
    url: '/v1/customers/v1/' + id,
    method: 'delete'
  })
}

export function findCustomer (data) {
  return request({
    url: '/v1/customers/v1/conditions',
    method: 'post',
    data
  })
}

export function setYear (data) {
  return request({
    url: '/v1/customers/v1/year/' + data,
    method: 'put'
  })
}
