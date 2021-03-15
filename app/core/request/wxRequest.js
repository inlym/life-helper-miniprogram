'use strict'

const buildUrl = require('./buildUrl.js')

/**
 * 对微信原生的 wx.request 方法的简单封装（不带业务逻辑，任何小程序都可以使用）
 * @description
 * 1. 参数格式兼容 axios
 */
module.exports = function wxRequest(options) {
  const { method, baseURL, url, headers, params, data, timeout } = options

  return new Promise((resolve, reject) => {
    wx.request({
      url: buildUrl(baseURL, url, params),
      data,
      header: headers,
      timeout: timeout || 6000,
      method: (method && method.toUpperCase()) || 'GET',
      success(res) {
        resolve({
          data: res.data,
          status: res.statusCode,
          headers: res.header,
        })
      },
      fail() {
        reject(new Error('内部原因，请求失败!'))
      },
    })
  })
}
