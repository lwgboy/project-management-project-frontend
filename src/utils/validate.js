/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 手机号
export function isPhone () {
  return /^1\d{10}$/
}

// 账号，支持字母、数字，限制20个字符
export function isUserName () {
  return /^[a-zA-Z0-9]{1,20}$/
}

// 密码，支持字母、数字，限制16个字符
export function isPassword () {
  return /^[a-zA-Z0-9]{6,16}$/
}
