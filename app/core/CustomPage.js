'use strict'

const logger = require('./logger.js')
const setDataMethod = require('./page/methods/setData.js')
const bindResponseData = require('./page/methods/bindResponseData.js')
const mergeQueries = require('./page/methods/mergeQueries.js')
const qs = require('./qs.js')
const pull = require('./page/methods/pull.js')
const debugMethods = require('./page/methods/debug.js')
const transfer = require('./page/methods/transfer.js')
const defaults = require('./page/defaults.js')
const execRequestedTask = require('./page/methods/execRequestedTask.js')
const utils = require('./utils.js')
const storage = require('./storage.js')
const config = require('../config/config.js')
const route = require('./page/methods/route.js')
const HttpRequest = require('./HttpRequest.js')

const httpClient = HttpRequest.create(config)

module.exports = function CustomPage(configuration) {
  /** 在 {page}.js 的 data 中的内容 */
  const _originalData = configuration.data || {}

  /** 给页面添加的自定义方法 */
  const customMethods = {
    logger,
    qs,
    bindResponseData,
    mergeQueries,
    pull,
    utils,
    config,
    transferData: transfer.transferData,
    handleTransferredData: transfer.handleTransferredData,
    getTransferredFields: transfer.getTransferredFields,
    handleRequestedFields: transfer.handleRequestedFields,
    getUrl: route.getUrl,
    getQuery: route.getQuery,
    read: storage.get,
    write: storage.set,
    forward: route.forward,
    post: httpClient.post,
    request(opt) {
      return httpClient.request(opt)
    },
  }

  /** 最终用原生 Page 方法执行的配置内容 */
  const _finalConfiguration = {}

  // 汇总参数
  Object.assign(_finalConfiguration, defaults.lifetimes, configuration, customMethods)

  // 汇总 data 参数
  const data = {}
  Object.assign(data, defaults.data, _originalData)
  _finalConfiguration.data = data

  /** 页面配置项，可以覆盖在 defaults.config 配置的内容 */
  const _configOptions = {}
  Object.assign(_configOptions, defaults.config, configuration.config || {})
  _finalConfiguration._configOptions = _configOptions

  // 处理 requested 参数，如果 data 中没有同名属性，则添加
  if (configuration.requested) {
    Object.keys(configuration.requested).forEach((key) => {
      if (
        !_finalConfiguration['data'][key] ||
        typeof _finalConfiguration['data'][key] !== 'object'
      ) {
        _finalConfiguration['data'][key] = {}
      }
    })
  }

  // 处理 computed 参数，将值逐个加到 this.data
  if (configuration.computed) {
    Object.keys(configuration.computed).forEach((key) => {
      let value = {}
      try {
        value = configuration.computed[key](_finalConfiguration.data)
      } catch (err) {
        logger.error(err)
      }
      _finalConfiguration['data'][key] = value
    })
  }

  // 重写初始化方法
  const _originalInit = _finalConfiguration.init
  _finalConfiguration.init = function init(stage) {
    // 先执行页面配置的 init 方法
    if (typeof _originalInit === 'function') {
      _originalInit.call(this, stage)
    }

    execRequestedTask.call(this, stage)
  }

  // 重写原生的 onLoad
  const _originalOnLoad = _finalConfiguration.onLoad
  _finalConfiguration.onLoad = function onLoad(options) {
    // 存储原生的 setData, 不要有放在在此之前执行
    this._originalSetData = this.setData

    // 重载 setData
    this.setData = setDataMethod

    // 存储页面入参
    route.savePageUrlAndQuery.call(this)

    // 存储调试参数至 data 中
    debugMethods.saveDebugOptions.call(this)

    // 处理传值部分逻辑
    this.handleTransferredData()

    // 处理 requested 中与传值字段相同的字段
    this.handleRequestedFields()

    // 执行原有的 onLoad
    if (typeof _originalOnLoad === 'function') {
      // 先执行原有的 onLoad
      _originalOnLoad.call(this, options)
    }

    this.init('onLoad')
  }

  // 重写原有的 onPullDownRefresh
  const _originalOnPullDownRefresh = _finalConfiguration.onPullDownRefresh
  _finalConfiguration.onPullDownRefresh = function onPullDownRefresh() {
    if (typeof _onPullDownRefresh === 'function') {
      // 先执行原有的 _onPullDownRefresh
      _originalOnPullDownRefresh.call(this)
    }

    this.init('onPullDownRefresh')
  }

  // 注册页面
  Page(_finalConfiguration)
}
