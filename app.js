'use strict'

const configProd = require('./config/config.prod.js')
const configTest = require('./config/config.test.js')
const requestWrap = require('./lib/request.js')
const wxp = require('./lib/wxp.js')

App({
  onLaunch() {
    // wx.setStorageSync('token', 'laiyiming')
  },

  /**
   * 环境
   * 'prod' => 生产环境
   * 'test' => 测试环境
   */
  env: 'prod',

  /**
   * 配置信息，根据环境变量取对应配置文件
   * 配置文件均放置在 config/ 文件夹下
   */
  get config() {
    const { env } = this
    if (env === 'prod') {
      return configProd
    } else if (env === 'test') {
      return configTest
    } else {
      throw new Error('环境变量 env 配置错误')
    }
  },

  /** Promise 化后的 wx 接口 */
  wxp,

  request(options) {
    const { baseURL } = this.config
    if (typeof options === 'string') {
      return requestWrap({
        url: options,
        baseURL,
      })
    } else {
      options.baseURL = baseURL
      return requestWrap(options)
    }
  },

  get(options) {
    return this.request(options)
  },

  post(options) {
    if (typeof options !== 'object') {
      throw new Error('POST 请求的参数应该是一个对象')
    }
    options.method = 'POST'
    return this.request(options)
  },
})
