import request from '@/utils/request'

// 查询全部订单
export function findExpenseByPageAndCondition (data) {
  return request({
    url: '/v1/expenses/v1/conditions',
    method: 'post',
    data
  })
}

// 创建订单
export function createExpense (data) {
  return request({
    url: '/v1/expenses/v1',
    method: 'post',
    data
  })
}

// 修改订单
export function updateExpense (data) {
  return request({
    url: '/v1/expenses/v1',
    method: 'put',
    data
  })
}

// 根据主键删除订单
export function deleteExpense (id) {
  return request({
    url: '/v1/expenses/v1/' + id,
    method: 'delete'
  })
}

// 提交订单
export function submitExpense (id) {
  return request({
    url: '/v1/expenses/v1/' + id + '/submit',
    method: 'put'
  })
}
