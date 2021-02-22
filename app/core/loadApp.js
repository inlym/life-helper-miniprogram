'use strict'

const configAll = require('../config/config.js')
const { request } = require('./request.js')
const wxp = require('./wxp.js')
const cache = require('./storage.js')
const bindData = require('./bindData.js')
const authorize = require('../common/authorize.js')
const keys = require('./keys.js')

/**
 * 汇总需要挂载到 app 实例上的属性方法
 * @since 2021-02-20
 * @param {App} app app 实例对象
 */
function loadApp(app) {
  const res = {
    /** 挂载配置信息 */
    get config() {
      return configAll
    },

    /** Promise 化后的 wx 接口 */
    wxp,

    /** 挂载封装好的缓存处理函数 */
    cache,

    authorize,

    keys,

    get read() {
      return cache.read
    },

    get write() {
      return cache.write
    },

    /** 挂载封装好的请求函数 */
    request,

    bindData,

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

    /** 日志对象 */
    get logger() {
      const { env } = configAll
      if (env === 'test') {
        return console
      } else if (env === 'prod') {
        return wx.getRealtimeLogManager()
      } else {
        return console
      }
    },
  }

  Object.assign(res, app)

  return res
}

module.exports = loadApp
