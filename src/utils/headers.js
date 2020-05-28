// 设置请求头
import moment from 'moment'
import { getBrowserInfo, getBrowserOS } from '@/utils/userAgent'
import store from '../store'
export function getHeaders () {
  const userAgent = getBrowserInfo()
  return {
    'X-Build-Number': '1', // 构建号
    'X-App-Version': userAgent.version, // 版本号
    'X-Device-System-Info': getBrowserOS(), // 操作系统
    'X-Device-Type': userAgent.type, // 浏览器外壳
    'X-Time-Stamp': moment().format('x'), // x是到毫秒，X是到秒,
    'X-XSRF-TOKEN': store.getters.token
  }
}
