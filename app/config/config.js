'use strict'

const configProd = require('./config.prod.js')
const configTest = require('./config.test.js')

/**
 * 环境
 * 'prod' => 生产环境
 * 'test' => 测试环境
 */
const env = 'prod'

/** 最终输出的配置 */
const config = {
  env,

  /** 发送请求时用于传递 token 值的请求头字段名 */
  HEADER_TOKEN_FIELD: 'X-Lh-Token',

  /** 发送请求时用于传递微信小程序 wx.login 获取的 code 值的请求头字段名 */
  HEADER_CODE_FIELD: 'X-Lh-Code',

  /** 发送请求时用于传递微信小程序基本信息的请求头字段名 */
  HEADER_MPINFO_FIELD: 'X-Lh-Miniprogram',

  /** 在小程序 storage 中用于存储 token 的字段名 */
  STORAGE_TOKEN_FIELD: '__app_token__',

  /** 在小程序 storage 中用于存储最近一次登录时间的字段名 */
  STORAGE_LAST_LOGIN_TIME: '__time_last_login__',

  /** 在小程序 storage 中用于存储小程序本次启动时间的字段名 */
  STORAGE_APP_LAUNCH_TIME: '__time_app_launch__',
}

if (env === 'prod') {
  Object.assign(config, configProd)
} else if (env === 'test') {
  Object.assign(config, configTest)
} else {
  throw new Error('环境变量 env 配置错误')
}

module.exports = config
