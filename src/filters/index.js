import moment from 'moment'

// 将时间戳转化为日期+时间
export function formatTime (timestamp) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 字母转大写
export function upper (value) {
  if (!value) return ''
  value = value.toString()
  return value.toUpperCase()
}
