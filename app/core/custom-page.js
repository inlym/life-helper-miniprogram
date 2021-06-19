'use strict'

const request = require('./request')
const logger = require('./logger')

const execRequestedTasks = require('./page-requested-task')

/** 在 `data` 中存储页面 `onLoad` 的 `query` 的字段名 */
const DATA_QUERY = '__query__'

/**
 * `CustomPage` 实现以下功能：
 * 1. 在配置项 `requested` 注册的请求任务，在页面每次初始化（比如首次加载、下拉刷新等）自动发送请求并将响应数据自动赋值
 */
module.exports = function CustomPage(options) {
  // `init` 为自定义页面初始化方法
  const optInit = options.init
  options.init = function init(eventName) {
    if (typeof optInit === 'function') {
      optInit()
    }
    execRequestedTasks.call(this, eventName)
  }

  // 重写 `onLoad`
  const optOnLoad = options.onLoad
  options.onLoad = function onLoad(query) {
    // 存储 `query`
    this.setData({ [DATA_QUERY]: query })

    // 执行在页面中配置的 `onLoad`
    if (typeof optOnLoad === 'function') {
      optOnLoad()
    }

    this.init('onLoad')
  }

  // 重写 `onPullDownRefresh`
  const optOnPullDownRefresh = options.onPullDownRefresh
  options.onPullDownRefresh = function onPullDownRefresh() {
    if (typeof optOnPullDownRefresh === 'function') {
      optOnPullDownRefresh()
    }

    this.init('onPullDownRefresh')
  }

  // 添加 `query` getter，通过 `this.query` 方式获取页面入参
  Object.defineProperty(options, 'query', {
    get: function getter() {
      return this.data[DATA_QUERY]
    },
  })

  options.request = request
  options.logger = logger

  return Page(options)
}
