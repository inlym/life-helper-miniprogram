'use strict'

const qs = require('../../qs.js')

/**
 * 跳转到指定页面
 * @param {string|object} options 配置项
 * @param {object} event 事件对象
 */
function forward(opt, event) {
  const options = {}
  if (typeof opt === 'string') {
    options.url = opt
  } else if (typeof opt === 'object') {
    Object.assign(options, opt)
  }

  const queryObj = {}
  if (options.params && typeof options.params === 'object') {
    Object.assign(queryObj, options.params)
  }

  if (event) {
    const { dataset } = event.currentTarget
    Object.assign(queryObj, dataset)
  }

  wx.navigateTo({
    url: options.url + qs.getSearch(queryObj),
  })
}

module.exports = {
  forward,
}
