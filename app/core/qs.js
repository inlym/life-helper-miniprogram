'use strict'

/**
 * 将查询字符串转换为对象格式
 * @param {string} str 待转化的查询字符串
 */
function parse(str) {
  if (!str) {
    return {}
  }

  if (typeof str === 'object') {
    return str
  }

  // 去掉前面的问号（?）和井号（#）后面的内容
  const clearStr = str.replace(/^\?/u, '').replace(/#.*/u, '')

  // 拆分为 ['name=mark','age=19'] 形式的数组
  const parts = clearStr.split('&')

  const obj = {}
  for (let i = 0; i < parts.length; i++) {
    const [name, value] = parts[i].split('=')
    if (name && value) {
      obj[name] = value
    }
  }

  return obj
}

/**
 * 将查询字符串对象转化为字符串格式
 * @param {object} obj 查询字符串对象
 */
function stringify(obj) {
  if (typeof obj === 'string') {
    return obj
  }

  if (typeof obj !== 'object') {
    throw new Error('参数错误')
  }

  const arr = []
  Object.keys(obj).forEach((name) => {
    const value = obj[name].toString()
    if (value && typeof value === 'string' && value !== '[object Object]') {
      // 兼容数组，name=['a','b'] 会转变为 name=a,b
      arr.push(`${name}=${value}`)
    }
  })
  return arr.join('&')
}

/**
 * 生成 search 字符串
 * @param {object} obj 查询字符串对象
 */
function getSearch(obj) {
  const str = stringify(obj)
  if (!str) {
    return ''
  } else {
    return '?' + str
  }
}

module.exports = {
  parse,
  stringify,
  getSearch,
}
