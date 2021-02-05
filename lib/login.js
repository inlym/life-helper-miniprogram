'use strict'

const config = require('../config/config.js')
const wxp = require('./wxp.js')
const { requestWrap } = require('./request.js')

async function login() {
  /** 最近一次登录时间（毫秒数） */
  const lastLoginTime = wx.getStorageSync('last_login')

  if (lastLoginTime) {
    /** 当前时间（毫秒数） */
    const now = new Date().getTime()

    /** 保留登录时间 60s，期间内不再发起请求而返回已有的 token */
    const TIME_DIFF = 60 * 1000

    if (now - lastLoginTime < TIME_DIFF) {
      return wx.getStorageSync('token')
    }
  }

  const { baseURL } = config
  const { code } = await wxp.login()

  return requestWrap({
    baseURL,
    url: '/login',
    params: {
      code,
    },
    method: 'GET',
  }).then((res) => {
    const { token } = res.data
    if (token) {
      wx.setStorageSync('token', token)
      wx.setStorageSync('last_login', new Date().getTime())
      return token
    } else {
      wx.showToast({
        title: '网络异常，请检查您的网络连接',
        icon: 'none',
      })
    }
  })
}

module.exports = login
