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

/**
 * 消息提示拦截器
 *
 * 说明：
 * 1. 响应数据中的 `code` 和 `message` 是对响应结果的说明。
 * 2. `code` 为 `0` 或 `undefined` 表示请求成功。
 * 3. `message` 单独判断，用于展示提示。
 */
function messageInterceptor(response) {
  /**
   * 仅在 `response.data.message.type > 0` 情况下才需要做消息提示
   */
  if (
    typeof response.data === 'object' &&
    typeof response.data.message === 'object' &&
    typeof response.data.message.type === 'number' &&
    response.data.message.type > 0
  ) {
    const { type, title } = response.data.message

    /**
     * `type` 说明：
     * 1. `100~199` => `wx.showToast`
     * 2. `200~299` => `wx.showModal`
     */
    if (type === 100) {
      wx.showToast({ title, icon: 'none' })
    } else if (type === 101) {
      wx.showToast({ title, icon: 'success' })
    }
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
request.interceptors.response.use(messageInterceptor)

module.exports = request
