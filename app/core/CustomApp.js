'use strict'

const configAll = require('../config/config.js')
const storage = require('./storage.js')
const authorize = require('../common/authorize.js')
const CustomPage = require('./CustomPage.js')
const utils = require('./utils.js')
const location = require('../common/location.js')
const logger = require('../core/logger.js')

const request = require('./request.js')

/**
 * 汇总需要挂载到 app 实例上的属性方法
 * @since 2021-02-20
 * @param {App} app app 实例对象
 */
function CustomApp(configuration) {
  const output = {
    /** 挂载配置信息 */
    get config() {
      return configAll
    },

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
    const { STORAGE_APP_LAUNCH_TIME } = configAll.keys

    storage.set(STORAGE_APP_LAUNCH_TIME, Date.now())

    request('/login')

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

  App(output)
}

module.exports = CustomApp
