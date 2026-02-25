import request from '@/utils/request'

export function queryToolOrderByMachineCode(code) {
  return request({
    url: `/tool_order/code/${code}`,
    method: 'get'
  })
}

export function queryToolOrderByOrderStatus(order_status) {
  return request({
    url: `/tool_order/order_status/${order_status}`,
    method: 'get'
  })
}

export function updateToolOrder(data) {
  return request({
    url: '/tool_order/update',
    method: 'post',
    data
  })
}

export function addToolOrder(data) {
  return request({
    url: '/tool_order/add',
    method: 'post',
    data
  })
}

export function deleteToolOrder(id) {
  return request({
    url: `/tool_order/${id}`,
    method: 'delete'
  })
}

export function payToolOrder(id) {
  return request({
    url: `/tool_order/pay/${id}`,
    method: 'put'
  })
}

