'use strict'

/**
 * 执行指定一个在页面 requested 中注册的请求任务
 * @this WechatMiniprogram.Page.Instance
 * @since 2021-02-27
 * @param {string} key 变量名
 */
module.exports = function execRequestTask(key) {
  const options = this['requested'][key]

  if (typeof options === 'object') {
    const { url, queries, handler } = options

    /** 最终的查询字符串对象 */
    const query = {}

    if (queries) {
      const list = []
    }
  } else if (typeof options === 'string') {
    const url = options
    this.bindRequestData(key, url)
  } else {
    throw new Error('执行的请求任务未在 requested 中注册！')
  }
}
