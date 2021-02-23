'use strict'

const bindRequestData = require('./bindRequestData.js')
const { matchStr } = require('./utils.js')

function transformPageConfiguration(configuration) {
  /** 页面默认方法 */
  const defaultPageMethods = {
    bindRequestData,
  }

  /** 最终输出的页面配置对象 */
  const output = {}

  Object.assign(output, defaultPageMethods, configuration)

  // 处理 requested 参数，如果 data 中没有同名属性，则添加
  if (output.requested) {
    Object.keys(output.requested).forEach((key) => {
      if (!output['data'][key] || typeof output['data'][key] !== 'object') {
        output['data'][key] = {}
      }
    })
  }

  // 执行请求任务
  output._execRequestTask = function _execRequestTask(stage) {
    if (this.requested) {
      const { requested } = this
      console.log(requested)
      Object.keys(requested).forEach((key) => {
        const { url, query, handler, ignore } = requested[key]
        if (!matchStr(stage, ignore)) {
          this.bindRequestData(key, url, query, handler)
        }
      })
    }
  }

  /** 保存原有的 onLoad */
  const _onLoad = output.onLoad

  output.onLoad = function onLoad(options) {
    if (typeof _onLoad === 'function') {
      // 执行原有的 onLoad
      _onLoad.call(this, options)
    }
    this._execRequestTask('onLoad')
  }

  return output
}

function CustomPage(configuration) {
  const finalConfiguration = transformPageConfiguration(configuration)
  if (finalConfiguration.debug) {
    console.log('Page Configuration', finalConfiguration)
  }
  Page(transformPageConfiguration(finalConfiguration))
}

module.exports = CustomPage
