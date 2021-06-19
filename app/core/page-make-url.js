'use strict'

/**
 * 生成小程序内可用的跳转路径
 * @param {string} path 路径
 * @param {Object} params 参数
 */
module.exports = function makeUrl(path, params) {
  if (typeof params !== 'object') {
    return path
  }

  const basicType = ['number', 'string', 'boolean']

  const querystring = Object.keys(params)
    .filter((key) => basicType.includes(typeof params[key]))
    .map((key) => `${key}=${params[key]}`)
    .sort()
    .join('&')

  return querystring ? path + '?' + querystring : path
}
