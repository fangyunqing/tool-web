import request from '@/utils/request'

export function queryToolUserByCode(code) {
  return request({
    url: `/tool_user/code/${code}`,
    method: 'get'
  })
}

export function queryToolUser() {
  return request({
    url: `/tool_user/list`,
    method: 'get'
  })
}

export function createToolUser(data) {
  return request({
    url: '/tool_user/add',
    method: 'post',
    data
  })
}

export function renewToolOrder(data) {
  return request({
    url: '/tool_user/update',
    method: 'post',
    data
  })
}

export function removeToolOrder(code) {
  return request({
    url: `/tool_user/${code}`,
    method: 'delete'
  })
}
