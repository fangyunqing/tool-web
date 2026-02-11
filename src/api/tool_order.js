import request from '@/utils/request'

export function queryToolOrderByMachineCode(code) {
  return request({
    url: `/api/tool_order/${code}`,
    method: 'get'
  })
}

export function updateToolOrder(data) {
  return request({
    url: '/api/tool_order/update',
    method: 'post',
    data
  })
}

export function addToolOrder(data) {
  return request({
    url: '/api/tool_order/add',
    method: 'post',
    data
  })
}

export function deleteToolOrder(id) {
  return request({
    url: `/api/tool_order/${id}`,
    method: 'delete'
  })
}

