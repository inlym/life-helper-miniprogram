'use strict'

module.exports = function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res.code)
      },
      fail() {
        reject(new Error('内部原因，获取 code 失败!'))
      },
    })
  })
}
