// 对象参数值赋值
export function copyObject (temp, from, to) {
  for (const props in temp) {
    to[props] = from[props]
  }
}
