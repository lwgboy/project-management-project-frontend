import request from '@/utils/request'

// 查询全部订单
export function findPurchaseByPageAndCondition (data) {
  return request({
    url: '/v1/purchases/v1/conditions',
    method: 'post',
    data
  })
}

// 创建采购单
export function createPurchase (data) {
  return request({
    url: '/v1/purchases/v1',
    method: 'post',
    data
  })
}

// 修改采购单
export function updatePurchase (data) {
  return request({
    url: '/v1/purchases/v1',
    method: 'put',
    data
  })
}

// 根据主键删除采购单
export function deletePurchase (id) {
  return request({
    url: '/v1/purchases/v1/' + id,
    method: 'delete'
  })
}

// 提交采购单
export function submitOrder (id) {
  return request({
    url: '/v1/purchases/v1/' + id + '/submit',
    method: 'put'
  })
}
