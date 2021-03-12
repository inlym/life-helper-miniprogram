'use strict'

const logger = require('../logger.js')
const setData = require('./methods/setData.js')
const showLoading = require('./methods/showLoading.js')
const bindResponseData = require('./methods/bindResponseData.js')
const mergeQueries = require('./methods/mergeQueries.js')
const getLoadOptions = require('./methods/getLoadOptions.js')
const transfer = require('./methods/transfer.js')
const utils = require('../utils.js')
const defaults = require('./defaults.js')

module.exports = function CustomPage(configuration) {
  /** 在 {page}.js 的 data 中的内容 */
  const _originalData = configuration.data || {}

  /** 给页面添加的自定义方法 */
  const customMethods = {
    showLoading,
    logger,
    bindResponseData,
    mergeQueries,
    getLoadOptions,
    transferData: transfer.transferData,
    handleTransferredData: transfer.handleTransferredData,
    getTransferredFields: transfer.getTransferredFields,
    handleRequestedFields: transfer.handleRequestedFields,
  }

  /** 最终用原生 Page 方法执行的配置内容 */
  const _finalConfiguration = {}

  // 汇总参数
  Object.assign(_finalConfiguration, defaults.lifetimes, configuration, customMethods)

  // 汇总 data 参数
  const data = {}
  Object.assign(data, defaults.data, _originalData)
  _finalConfiguration.data = data

  /**
   * CustomPage 添加的自定义调试参数：
   * 1. setData         -  每次 setData 时打印赋值数据
   * 2. configuration   -  打印页面初始配置和最终配置
   */
  _finalConfiguration._debugOptions = configuration.debug || {}

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

  // 添加执行 requested 中的请求任务方法
  _finalConfiguration._execAllRequestTask = function _execAllRequestTask(stage) {
    return new Promise((resolve) => {
      if (this.requested) {
        const taskPromises = []
        this._originalSetData({
          __page_on_requesting__: true,
        })
        Object.keys(this.requested).forEach((key) => {
          const { url, queries, handler, ignore } = this.requested[key]
          if (!utils.matchStr(stage, ignore)) {
            const query = this.mergeQueries(queries)
            taskPromises.push(this.bindResponseData(key, url, query, handler))
          }
        })
        Promise.all(taskPromises).then((res) => {
          this._originalSetData({
            __page_on_requesting__: false,
          })
          resolve(res)
        })
      } else {
        resolve([])
      }
    })
  }

  // 重写初始化方法
  const _originalInit = _finalConfiguration.init
  _finalConfiguration.init = function init(stage) {
    // 先执行页面配置的 init 方法
    if (typeof _originalInit === 'function') {
      _originalInit.call(this, stage)
    }

    this.showLoading('数据加载中 ...')
    this._execAllRequestTask(stage).then(() => {
      wx.hideLoading()
      if (stage === 'onPullDownRefresh') {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '页面数据已更新',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  }

  // 重写原生的 onLoad
  const _originalOnLoad = _finalConfiguration.onLoad
  _finalConfiguration.onLoad = function onLoad(options) {
    // 存储原生的 setData
    this._originalSetData = this.setData

    // 重载 setData
    this.setData = setData

    // 将入参存储
    this._originalSetData({
      __page_load_options__: options,
    })

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

  // 删除多余配置项
  delete _finalConfiguration.debug
  delete _finalConfiguration.config

  // 调试日志
  if (_finalConfiguration._debugOptions.configuration) {
    logger.debug('[Page Configuration] - Original \n', configuration)
    logger.debug('[Page Configuration] - Final \n', _finalConfiguration)
  }

  // 注册页面
  Page(_finalConfiguration)
}
