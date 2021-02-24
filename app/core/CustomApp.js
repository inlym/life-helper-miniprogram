'use strict'

const configAll = require('../config/config.js')
const { request } = require('./request.js')
const wxp = require('./wxp.js')
const storage = require('./storage.js')
const authorize = require('../common/authorize.js')
const keys = require('./keys.js')
const CustomPage = require('./CustomPage.js')
const logger = require('./logger.js')
const utils = require('./utils.js')

/**
 * 汇总需要挂载到 app 实例上的属性方法
 * @since 2021-02-20
 * @param {App} app app 实例对象
 */
function transformAppConfiguration(configuration) {
  const output = {
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

    utils,

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

  Object.assign(output, configuration)

  // 重写 onLaunch
  const _onLaunch = output.onLaunch
  output.onLaunch = function onLaunch(options) {
    // 本地记录小程序启动时间
    this.write(this.keys.KEY_APP_LAUNCH_TIME, utils.nowMs())

    // 执行原有的 onLaunch
    if (typeof _onLaunch === 'function') {
      _onLaunch.call(this, options)
    }

    this.logger.info('小程序 onLaunch，参数为', options)
  }

  // 重写 onShow
  const _onShow = output.onShow
  output.onShow = function onShow(options) {
    // 覆盖记录小程序 onShow 时间
    this.write(this.keys.KEY_APP_SHOW_TIME, utils.nowMs())

    // 执行原有的 onShow
    if (typeof _onShow === 'function') {
      _onShow.call(this, options)
    }

    this.logger.info('小程序 onShow，参数为', options)
  }

  return output
}

function CustomApp(configuration) {
  const finalConfiguration = transformAppConfiguration(configuration)
  if (finalConfiguration.debug) {
    console.log('App Configuration', finalConfiguration)
  }
  App(finalConfiguration)
}

module.exports = CustomApp
