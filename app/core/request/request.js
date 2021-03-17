'use strict'

const wxRequest = require('./wxRequest.js')
const getCode = require('./getCode.js')
const config = require('../../config/config.js')
const qs = require('../qs.js')

const {
  baseURL,
  STORAGE_TOKEN_FIELD,
  HEADER_CODE_FIELD,
  HEADER_TOKEN_FIELD,
  HEADER_MPINFO_FIELD,
} = config

const mpInfo = qs.stringify(wx.getAccountInfoSync().miniProgram).replace(/&/gu, '; ')

/**
 * 封装在业务代码实际使用的请求方法（仅适用于当前小程序）
 */
module.exports = async function request(options) {
  // 当前函数不要使用 baseURL 参数
  const { method, url, headers, params, data, retries = 3 } = options

  const headersNew = headers || {}

  const localToken = wx.getStorageSync(STORAGE_TOKEN_FIELD)
  if (localToken) {
    headersNew[HEADER_TOKEN_FIELD] = localToken
  } else {
    const code = await getCode()
    headersNew[HEADER_CODE_FIELD] = code
  }

  headersNew[HEADER_MPINFO_FIELD] = mpInfo

  const requestOptions = { baseURL, method, url, params, data, headers: headersNew }
  const response = await wxRequest(requestOptions)

  if (response.status >= 200 && response.status < 300) {
    return response
  }

  if (typeof retries === 'number' && retries > 0) {
    wx.removeStorageSync(HEADER_TOKEN_FIELD)
    options.retries = retries - 1
    return request(options)
  } else {
    throw new Error('请求错误，重试 3 次后仍无法请求成功!')
  }
}
