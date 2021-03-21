'use strict'

const qs = require('../../qs.js')
const logger = require('../../logger.js')

/** 在 data 中存储 url 的字段名 */
const urlField = '__page_url__'

/** 在页面的 data 中存储 query 的字段名 */
const queryField = '__page_query__'

/**
 * 从页面栈获取并存储当前页面的 URL 和 query
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 执行时间应在重定义原生方法后，页面 onLoad 前（仅执行一次即可，无需绑定到页面方法）
 */
function savePageUrlAndQuery() {
  const list = getCurrentPages()
  const current = list[list.length - 1]
  const { route: url, options } = current
  this._originalSetData({
    [urlField]: url,
    [queryField]: options,
  })

  logger.debug('[Route]', url + qs.getSearch(options))
}

/**
 * 获取当前页面的 URL
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 该方法绑定至页面方法上
 */
function getUrl() {
  return this.data[urlField]
}

/**
 * 获取当前页面的 query 参数
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 该方法绑定至页面方法上
 */
function getQuery() {
  return this.data[queryField]
}

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
  savePageUrlAndQuery,
  forward,
  getUrl,
  getQuery,
}
