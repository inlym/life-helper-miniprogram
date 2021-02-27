'use strict'

const utils = require('../../utils.js')

/**
 * 合并多个查询字符串处理器的结果
 * @this WechatMiniprogram.Page.Instance
 * @param {string | Arrar} queries
 * @returns {Object}
 */
module.exports = function mergeQueries(queries) {
  if (queries === undefined) {
    return {}
  }

  const queryMethodList = []
  const query = {}

  if (typeof queries === 'string' || typeof queries === 'function') {
    utils.assignArray(queryMethodList, [queries])
  }

  if (typeof queries === 'object' && queries.length > 0) {
    utils.assignArray(queryMethodList, queries)
  }

  for (let i = 0; i < queryMethodList.length; i++) {
    const item = queryMethodList[i]

    if (typeof item === 'string') {
      // 字符串，则执行同名方法
      Object.assign(query, this[item]())
    } else if (typeof item === 'function') {
      // 函数，则直接执行
      Object.assign(query, item())
    } else if (typeof item === 'object') {
      // 对象，则直接合并
      Object.assign(query, item)
    }
  }
  return query
}
