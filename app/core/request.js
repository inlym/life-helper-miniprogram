'use strict'

const jshttp = require('jshttp')
const { getCode } = require('./wxp')
const configuration = require('../config')
const constants = require('./constants')
const logger = require('./logger')

const { STO_TOKEN } = constants

/**
 * 添加鉴权信息中间件
 *
 * 说明：
 * 1. 存在 `token` 则在请求头 `authorization` 附加 `TOKEN ${token}` 格式内容
 * 2. 意外处理：无 `token` 则获取 `code` 在请求头 `authorization` 附加 `CODE ${code}` 格式内容
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
 *
 * 说明：
 * 1. 附加了 2 个请求头 `x-mp-info` 和 `x-mp-system` 用于传输设备信息
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
 * 日志拦截器
 */
function loggerInterceptor(response) {
  const { status, config } = response
  const message = `[HTTP] [${status}] [${config.method.toUpperCase()}] ${jshttp.getUrl(config)}`
  if (status >= 200 && status < 300) {
    // logger.debug(message)

    // 临时改为 `info`，用于调试查看是否日志正常（2021.07.05）
    logger.info(message)
  }

  if (response.status >= 400) {
    const authorization = config.headers.authorization || config.headers.Authorization
    logger.error(message + ` authorization=${authorization}`)
  }

  return response
}

/**
 * 无效鉴权信息拦截器（处理策略：清除本地鉴权信息）
 */
function invalidAuthInterceptor(response) {
  if (response.status === 401) {
    wx.removeStorageSync(STO_TOKEN)
  }

  return response
}

const defaultConfig = {
  baseURL: configuration.baseURL,
  signature: configuration.signature,
  validateStatus(status) {
    // 相当于始终返回 `true`，由拦截器处理错误
    return status >= 200 && status < 600
  },
}

const request = jshttp.create(defaultConfig)

request.interceptors.request.use(attachSystemInfoInterceptor)
request.interceptors.request.use(authInterceptor)
request.interceptors.response.use(messageInterceptor)
request.interceptors.response.use(loggerInterceptor)
request.interceptors.response.use(invalidAuthInterceptor)

module.exports = request
