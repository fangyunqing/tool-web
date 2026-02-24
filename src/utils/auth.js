export const TokenKey = 'tool_token'
export const CodeKey = 'user_code'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUserCode() {
  return localStorage.getItem(CodeKey)
}

export function setUserCode(code) {
  return localStorage.setItem(CodeKey, code)
}

export function removeUserCode() {
  return localStorage.removeItem(CodeKey)
}
