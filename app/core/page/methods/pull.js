'use strict'

const mergeQueries = require('./mergeQueries.js')
const bindResponseData = require('./bindResponseData.js')

/**
 * 执行一次在页面 requested 注册的请求（请求并赋值）
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 使用 pull 发送请求忽略 ignore 参数限制
 */
function pull(name) {
  const requested = this.requested || {}

  const content = requested[name]

  if (!content) {
    throw new Error('请求任务未在 requested 中注册!')
  }

  const { url, queried, handler } = content
  const query = mergeQueries.call(this, queried)
  return bindResponseData.call(this, name, url, query, handler)
}

module.exports = pull
