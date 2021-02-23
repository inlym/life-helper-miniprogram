'use strict'

const bindRequestData = require('./bindRequestData.js')
const { matchStr } = require('./utils.js')

function transformPageConfiguration(configuration) {
  /** 自定义的页面方法，请不要在页面配置中使用同名参数覆盖 */
  const customPageMethods = {
    bindRequestData,

    getLoadOptions() {
      return this.data._loadOptions
    },
  }

  /** 页面默认生命周期函数，页面内若有配置则覆盖默认值 */
  const defaultLifecycle = {
    /** 用户点击右上角分享 */
    onShareAppMessage(res) {
      return {
        imageUrl: 'https://img.lh.inlym.com/share/index_share.jpeg',
        title: '[来自好友推荐] 好友评价：十分实用，页面也很好看，推荐给你',
        path: '/pages/index/index',
      }
    },

    /** 用户点击右上角菜单“分享到朋友圈”按钮 */
    onShareTimeline() {
      return {
        title: '[来自好友推荐] 好友评价：五星好评的智能生活助手',
      }
    },
  }

  /** 最终输出的页面配置对象 */
  const output = {}

  Object.assign(output, defaultLifecycle, configuration, customPageMethods)

  // 如果没有 data 属性，则加上
  output.data = output.data || {}

  // 处理 requested 参数，如果 data 中没有同名属性，则添加
  if (output.requested) {
    Object.keys(output.requested).forEach((key) => {
      if (!output['data'][key] || typeof output['data'][key] !== 'object') {
        output['data'][key] = {}
      }
    })
  }

  // 执行 requested 中的请求任务
  output._execRequestTask = function _execRequestTask(stage) {
    if (this.requested) {
      const { requested } = this
      Object.keys(requested).forEach((key) => {
        const { url, query, handler, ignore } = requested[key]
        if (!matchStr(stage, ignore)) {
          this.bindRequestData(key, url, query, handler)
        }
      })
    }
  }

  // 重新内部定义初始化方法
  const _init2 = output._init
  output._init = function _init(stage) {
    if (typeof _init2 === 'function') {
      _init2.call(this, stage)
    }

    this._execRequestTask(stage)
  }

  // 重写原有的 onLoad
  const _onLoad = output.onLoad
  output.onLoad = function onLoad(options) {
    // 将入参 options 存储
    this.setData({
      _loadOptions: options,
    })
    if (typeof _onLoad === 'function') {
      // 先执行原有的 onLoad
      _onLoad.call(this, options)
    }

    this._init('onLoad')
  }

  // 重写原有的 onPullDownRefresh
  const _onPullDownRefresh = output.onPullDownRefresh
  output.onPullDownRefresh = function onPullDownRefresh() {
    if (typeof _onPullDownRefresh === 'function') {
      // 先执行原有的 _onPullDownRefresh
      _onPullDownRefresh.call(this)
    }

    // 在 onLoad 中执行一次请求任务
    this._init('onPullDownRefresh')
    console.log('onPullDownRefresh')
  }

  return output
}

function CustomPage(configuration) {
  const finalConfiguration = transformPageConfiguration(configuration)
  if (finalConfiguration.debug) {
    console.log('Page Configuration', finalConfiguration)
  }
  Page(finalConfiguration)
}

module.exports = CustomPage
