'use strict'

const { getCode } = require('./wxp')
const request = require('./request')
const constants = require('./constants')

const { STO_TOKEN } = constants

module.exports = async function login() {
  const code = await getCode()
  const response = await request({
    url: '/login',
    headers: { authorization: `CODE ${code}` },
  })

  const { token } = response.data
  if (token) {
    wx.setStorageSync(STO_TOKEN, token)
    return token
  } else {
    wx.showToast({
      title: '登录失败！',
      icon: 'none',
    })
    return ''
  }
}
