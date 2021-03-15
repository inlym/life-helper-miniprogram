'use strict'

const configAll = require('../config/config.js')
const storage = require('./storage.js')
const authorize = require('../common/authorize.js')
const CustomPage = require('./page/CustomPage.js')
const logger = require('./logger.js')
const utils = require('./utils.js')
const location = require('../common/location.js')

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

    /** 挂载封装好的缓存处理函数 */
    cache: storage,
    storage,

    authorize,

    location,

    CustomPage,

    logger,

    utils,
  }

  Object.assign(output, configuration)

  // 重写 onLaunch
  const _onLaunch = output.onLaunch
  output.onLaunch = function onLaunch(options) {
    // 本地记录小程序启动时间
    this.storage.set('__time_app_launch__', utils.nowMs())

    // 执行原有的 onLaunch
    if (typeof _onLaunch === 'function') {
      _onLaunch.call(this, options)
    }
  }

  // 重写 onShow
  const _onShow = output.onShow
  output.onShow = function onShow(options) {
    // 执行原有的 onShow
    if (typeof _onShow === 'function') {
      _onShow.call(this, options)
    }
  }

  return output
}

function CustomApp(configuration) {
  App(transformAppConfiguration(configuration))
}

module.exports = CustomApp
