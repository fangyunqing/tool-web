import request from '@/utils/request'

export function login(admin_code) {
  return request({
    url: `/login/${admin_code}`,
    method: 'put'
  })
}
