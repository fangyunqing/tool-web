import request from '@/utils/request'

export function queryToolConfigPrice(code) {
  return request({
    url: `/tool_config/price`,
    method: 'get'
  })
}
