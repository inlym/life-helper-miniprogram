'use strict'

const configAll = require('../config/config.js')
const { request } = require('./request.js')
const wxp = require('./wxp.js')
const storage = require('./storage.js')
const authorize = require('../common/authorize.js')
const keys = require('./keys.js')
const CustomPage = require('./CustomPage.js')
const logger = require('./logger.js')

/**
 * 汇总需要挂载到 app 实例上的属性方法
 * @since 2021-02-20
 * @param {App} app app 实例对象
 */
function transformAppConfiguration(configuration) {
  const res = {
    /** 挂载配置信息 */
    get config() {
      return configAll
    },

    /** Promise 化后的 wx 接口 */
    wxp,

    /** 挂载封装好的缓存处理函数 */
    cache: storage,
    storage,

    authorize,

    CustomPage,

    keys,

    logger,

    get read() {
      return storage.read
    },

    get write() {
      return storage.write
    },

    /** 挂载封装好的请求函数 */
    request,

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
  }

  Object.assign(res, configuration)

  return res
}

function CustomApp(configuration) {
  const finalConfiguration = transformAppConfiguration(configuration)
  if (finalConfiguration.debug) {
    console.log('App Configuration', finalConfiguration)
  }
  App(finalConfiguration)
}

module.exports = CustomApp
