// 存account用于获取用户菜单
const accountKey = 'X-XSRF-ACCOUNT'
export function setAccount (account) {
  return localStorage.setItem(accountKey, account)
}

export function getAccount () {
  const value = localStorage.getItem(accountKey)
  return !value ? '' : value
}

export function removeAccount (account) {
  return localStorage.removeItem(account)
}

// 存对象
export function setStorage (key, value) {
  return localStorage.setItem(key, JSON.stringify(value))
}
export function getStorage (key) {
  const value = localStorage.getItem(key)
  return !value ? '' : JSON.parse(value)
}
export function removeStorage (key) {
  return localStorage.removeItem(key)
}
