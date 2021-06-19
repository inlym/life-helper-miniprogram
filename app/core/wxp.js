'use strict'

/**
 * 对微信原生函数仅做一层简单封装的函数放在这里
 */

exports.getCode = function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res.code)
      },
      fail() {
        reject(new Error('调用 wx.login 失败!'))
      },
    })
  })
}
