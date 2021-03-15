'use strict'

const config = require('../../config/config.js')

const { baseURL, STORAGE_TOKEN_FIELD, STORAGE_LAST_LOGIN_TIME } = config

module.exports = function login() {
  return new Promise((resolve, reject) => {
    // 如果最近一次登录在 1 分钟内，则不需要重新登录，避免并发请求多次登录
    const lastLoginTime = wx.getStorageSync(STORAGE_LAST_LOGIN_TIME)
    const nowMs = new Date().getTime()

    if (lastLoginTime && nowMs - lastLoginTime < 60000) {
      resolve(wx.getStorageSync(STORAGE_TOKEN_FIELD))
    } else {
      wx.login({
        success(res) {
          const { code } = res
          wx.request({
            url: baseURL + '/login?code=' + code,
            method: 'GET',
            timeout: 6000,
            success(res2) {
              if (res2.statusCode === 200) {
                const { token } = res2.data
                wx.setStorageSync(STORAGE_TOKEN_FIELD, token)
                wx.setStorageSync(STORAGE_LAST_LOGIN_TIME, new Date().getTime())
                resolve(token)
              } else {
                reject(new Error('登录失败，错误原因：' + res2.data.errmsg))
              }
            },
            fail() {
              reject(new Error('内部原因，请求失败!'))
            },
          })
        },
      })
    }
  })
}
