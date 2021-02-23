'use strict'

/**
 * 比较是否匹配，一般用于配置项比较
 * @param {string} source 待比较的字符串
 * @param {string} target 被比较的字符串或数组
 */
function matchStr(source, target) {
  if (source === undefined || target === undefined) {
    return false
  }

  if (typeof target === 'string') {
    return source === target
  } else {
    return target.includes(source)
  }
}

module.exports = {
  matchStr,
}
