'use strict'

const request = require('../core/request')

/**
 * 扫描二维码后发送
 */
function scanQrcode(code) {
  request({
    method: 'POST',
    url: '/login/confirm',
    params: { type: 'scan' },
    data: { code },
  })
}

function confirmQrcode(code) {
  request({
    method: 'POST',
    url: '/login/confirm',
    params: { type: 'confirm' },
    data: { code },
  })
}

module.exports = { scanQrcode, confirmQrcode }
