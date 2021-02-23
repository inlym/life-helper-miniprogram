'use strict'

const bindRequestData = require('./bindRequestData.js')

function producePageConfiguration(configuration) {
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
      Object.keys(requested).forEach((key) => {
        const { ignore } = requested[key]
        if (!ignore) {
        }
      })
    }
  }

  /** 保存原有的 onLoad */
  const _onLoad = output.onLoad

  output.onLoad = function onLoad(options) {
    // 执行原有的 onLoad
    _onLoad.call(this, options)
  }

  return output
}

function CustomPage(configuration) {
  Page(producePageConfiguration(configuration))
}

module.exports = CustomPage
