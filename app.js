'use strict'

const configAll = require('./app/config/config.js')
const { requestWrap, request } = require('./app/lib/request.js')
const wxp = require('./app/lib/wxp.js')
const cache = require('./app/lib/cache.js')
const login = require('./app/lib/login.js')

App({
  /** 生命周期回调 —— 监听小程序初始化 */
  onLaunch() {
    // 小程序初始化时进行一次登录，从服务端获取 token，保存至缓存中
    this.login()
  },

  /** 挂载配置信息 */
  get config() {
    return configAll
  },

  /** Promise 化后的 wx 接口 */
  wxp,

  /** 挂载封装好的缓存处理函数 */
  cache,

  /** 挂载封装好的请求函数 */
  request,

  /** 挂载封装好的登录函数 */
  login,

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
    if (this.env === 'test') {
      return console
    } else if (this.env === 'prod') {
      return wx.getRealtimeLogManager()
    }
  },
})
