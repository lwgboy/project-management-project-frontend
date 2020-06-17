import request from '@/utils/request'

// 查询全部客户
export function findAllCustomer () {
  return request({
    url: '/v1/customers/v1',
    method: 'get'
  })
}
