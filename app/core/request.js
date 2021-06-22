'use strict'

const jshttp = require('jshttp')
const { getCode } = require('./wxp')
const configuration = require('../config')
const constants = require('./constants')
const logger = require('./logger')

const { STO_TOKEN } = constants

/**
 * 添加鉴权信息中间件
 */
async function authInterceptor(config) {
  const token = wx.getStorageSync(STO_TOKEN)
  if (token && typeof config.url === 'string' && config.url.indexOf('/login') === -1) {
    config.headers['authorization'] = `TOKEN ${token}`
  } else {
    const code = await getCode()
    config.headers['authorization'] = `CODE ${code}`
  }

  return config
}

/**
 * 用于添加设备信息
 */
async function attachSystemInfoInterceptor(config) {
  const { appId, envVersion, version } = wx.getAccountInfoSync().miniProgram

  const [battery, network, screen] = await Promise.all([wx.getBatteryInfo(), wx.getNetworkType(), wx.getScreenBrightness()])
  const systemInfo = {
    batteryCharging: battery.isCharging,
    batteryLevel: battery.level,
    networkType: network.networkType,
    signalStrength: network.signalStrength || 'unknown',
    screenValue: screen.value,
  }

  if (!config.headers['x-mp-info']) {
    config.headers['x-mp-info'] = `appId=${appId};envVersion=${envVersion};version=${version};`
  }

  if (!config.headers['x-mp-system']) {
    config.headers['x-mp-system'] = JSON.stringify(systemInfo)
  }

  return config
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

/**
 * 将错误请求打日志
 */
function errorLoggerInterceptor(response) {
  if (response.status >= 400) {
    logger.error(`请求发生错误，status => ${response.status}，baseURL => ${response.config.baseURL}，url => ${response.config.url}`)
  }

  return response
}

const defaultConfig = {
  baseURL: configuration.baseURL,
  signature: configuration.signature,
}

const request = jshttp.create(defaultConfig)

request.interceptors.request.use(attachSystemInfoInterceptor)
request.interceptors.request.use(authInterceptor)
request.interceptors.response.use(messageInterceptor)
request.interceptors.response.use(errorLoggerInterceptor)

module.exports = request
