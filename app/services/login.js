'use strict'

const request = require('../core/request')

/**
 * 扫码登录确认
 */
async function confirmCheckCode(code) {
  const response = await request({
    url: '/login/confirm',
    method: 'post',
    data: { code },
  })

  return response.data
}

module.exports = { confirmCheckCode }
