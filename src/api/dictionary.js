import request from '@/utils/request'

// 查询全部字典
export function findAllDictionary () {
  return request({
    url: '/v1/dictionaries/v1',
    method: 'get'
  })
}
