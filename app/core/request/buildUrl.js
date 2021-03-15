'use strict'

const qs = require('../qs.js')

module.exports = function buildUrl(baseURL, url, params) {
  // 拼接微信请求需要的 url 格式
  let result = baseURL || ''

  if (url) {
    if (url.indexOf('https:') !== -1 || url.indexOf('http:') !== -1) {
      // 如果 url 是绝对路径，那么就不用 baseURL
      result = url
    } else {
      // 两段拼接，可能前者后面和后者前面带有 '/' ，若有则去掉
      result = result.replace(/\/+$/u, '') + '/' + url.replace(/^\/+/u, '')
    }
  }

  if (params) {
    const str = qs.stringify(params)
    if (str) {
      if (result.indexOf('?') !== -1) {
        result = result.replace(/\/+$/u, '') + '?' + str
      } else {
        result = result.replace(/\/+$/u, '') + '&' + str
      }
    }
  }

  return result
}
