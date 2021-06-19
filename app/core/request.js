'use strict'

const jshttp = require('jshttp')
const { getCode } = require('./wxp')
const configuration = require('../config')

/** 在小程序 storage 中用于存储 token 的字段名 */
const TOKEN_FIELD = '__app_token__'

/**
 * 添加鉴权信息中间件
 */
async function authInterceptor(config) {
  const token = wx.getStorageSync(TOKEN_FIELD)
  if (token && typeof config.url === 'string' && config.url.indexOf('/login') === -1) {
    config.headers['authorization'] = `TOKEN ${token}`
  } else {
    const code = await getCode()
    config.headers['authorization'] = `CODE ${code}`
  }

  return config
}

/**
 * 存储 token
 */
function saveTokenInterceptor(response) {
  if (response.data && response.data.token) {
    wx.setStorageSync(TOKEN_FIELD, response.data.token)
  }

  return response
}

const defaultConfig = {
  baseURL: configuration.baseURL,
  signature: configuration.signature,
}

const request = jshttp.create(defaultConfig)

request.interceptors.request.use(authInterceptor)
request.interceptors.response.use(saveTokenInterceptor)

module.exports = request
