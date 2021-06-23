'use strict'

const request = require('./request')
const logger = require('./logger')
const { getCode } = require('./wxp')
const { STO_TOKEN } = require('./constants')

module.exports = async function login() {
  const code = await getCode()
  const response = await request({
    url: '/login',
    headers: { authorization: `CODE ${code}` },
  })

  const { token } = response.data
  logger.info(`[登录成功] code=${code}, token=${token}`)
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
