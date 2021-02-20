'use strict'

/**
 * 将所有 API 进行 Promise 化并导出
 */
const { promisifyAll } = require('miniprogram-api-promise')

const wxp = {}

promisifyAll(wx, wxp)

module.exports = wxp
