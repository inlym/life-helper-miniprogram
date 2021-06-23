'use strict'

const request = require('./request')
const logger = require('./logger')
const defaults = require('./page-defaults')
const execRequestedTasks = require('./page-requested-task')
const login = require('./login')
const constants = require('./constants')
const route = require('./page-route')
const makeUrl = require('./make-url')

const { STO_TOKEN, DATA_QUERY } = constants

/**
 * `CustomPage` 实现以下功能：
 * 1. 在配置项 `requested` 注册的请求任务，在页面每次初始化（比如首次加载、下拉刷新等）自动发送请求并将响应数据自动赋值
 */
module.exports = function CustomPage(options) {
  // `init` 为自定义页面初始化方法
  const optInit = options.init
  options.init = async function init(eventName) {
    // 先执行自定义的初始化方法
    if (typeof optInit === 'function') {
      optInit.call(this)
    }

    if (!wx.getStorageSync(STO_TOKEN)) {
      // 未登录就先等登录完毕再进行后续流程
      await login()
    }

    // 发送页面注册请求
    execRequestedTasks.call(this, eventName)
  }

  // 重写 `onLoad`
  const optOnLoad = options.onLoad
  options.onLoad = function onLoad(query) {
    // 存储 `query`
    this.setData({ [DATA_QUERY]: query })

    logger.debug(`[Route] ${makeUrl(this.route, query)}`)

    // 执行在页面中配置的 `onLoad`
    if (typeof optOnLoad === 'function') {
      optOnLoad.call(this)
    }

    this.init('onLoad')
  }

  // 重写 `onPullDownRefresh`
  const optOnPullDownRefresh = options.onPullDownRefresh
  options.onPullDownRefresh = function onPullDownRefresh() {
    if (typeof optOnPullDownRefresh === 'function') {
      optOnPullDownRefresh.call(this)
    }

    this.init('onPullDownRefresh')
  }

  options.request = request
  options.logger = logger
  options.goTo = route.goTo
  options.query = function query(field) {
    const q = this.data[DATA_QUERY]
    if (field === undefined) {
      return q
    } else {
      return q[field]
    }
  }

  // 添加 defaults
  Object.keys(defaults).forEach((key) => {
    if (!options[key]) {
      options[key] = defaults[key]
    }
  })

  return Page(options)
}
