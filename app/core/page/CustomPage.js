'use strict'

const logger = require('../logger.js')
const setData = require('./methods/setData.js')
const bindRequestData = require('./methods/bindRequestData.js')
const showLoading = require('./methods/showLoading.js')
const utils = require('../utils.js')
const defaults = require('./defaults.js')

module.exports = function CustomPage(configuration) {
  /** 在 在 {page}.js 的 data 中的内容 */
  const _originalData = configuration.data || {}

  /** 给页面添加的自定义方法 */
  const customMethods = {
    bindRequestData,
    showLoading,
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
  _finalConfiguration._configOptions = configuration.config || {}

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
  _finalConfiguration._execRequestTask = function _execRequestTask(stage) {
    return new Promise((resolve) => {
      if (this.requested) {
        const taskPromises = []
        this._originalSetData({
          _onRequesting: true,
        })
        Object.keys(this.requested).forEach((key) => {
          const { url, query, handler, ignore } = this.requested[key]
          if (!utils.matchStr(stage, ignore)) {
            taskPromises.push(this.bindRequestData(key, url, query, handler))
          }
        })
        Promise.all(taskPromises).then((res) => {
          this._originalSetData({
            _onRequesting: false,
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

    // 目前暂无其他初始化任务，同时将请求任务从这里剥离出去，单独执行
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
      _loadOptions: options,
    })

    // 执行原有的 onLoad
    if (typeof _originalOnLoad === 'function') {
      // 先执行原有的 onLoad
      _originalOnLoad.call(this, options)
    }

    this.showLoading('页面加载中 ...')
    this.init('onLoad')
    this._execRequestTask('onLoad').then((res) => {
      wx.hideLoading()
    })
  }

  // 重写原有的 onPullDownRefresh
  const _originalOnPullDownRefresh = _finalConfiguration.onPullDownRefresh
  _finalConfiguration.onPullDownRefresh = function onPullDownRefresh() {
    if (typeof _onPullDownRefresh === 'function') {
      // 先执行原有的 _onPullDownRefresh
      _originalOnPullDownRefresh.call(this)
    }

    this.init('onPullDownRefresh')
    this._execRequestTask('onPullDownRefresh').then(() => {
      logger.debug('请求结束')
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
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
