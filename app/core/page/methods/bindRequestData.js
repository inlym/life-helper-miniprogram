'use strict'

const { request } = require('../../request.js')

/**
 * 关联页面数据和请求接口数据
 * @since 2021-02-19
 * @this
 * @param {string} pageDataName 在 data 内的变量名
 * @param {string} url 请求的 URL，不包含 query（查询字符串） 部分
 * @param  {...function | string} queryHandlerList query（查询字符串）处理函数列表，为空则调用 this._query
 */
async function bindRequestData(pageDataName, url, queryHandlerList, responseDataHandler) {
  /** 查询字符串对象 */
  const query = {}

  // 对 queryHandlerList 做简单处理
  if (queryHandlerList === null) {
    // 为 null 则不做任何处理
  } else if (queryHandlerList === undefined || queryHandlerList === 'default') {
    if (this._query && typeof this._query === 'function') {
      const res = this._query()
      if (typeof res === 'object') {
        Object.assign(query, res)
      }
    }
  } else {
    if (typeof queryHandlerList === 'string' || typeof queryHandlerList === 'function') {
      queryHandlerList = [queryHandlerList]
    }

    for (let i = 0; i < queryHandlerList.length; i++) {
      const item = queryHandlerList[i]

      if (typeof item === 'string') {
        // 如果是字符串，则直接执行当前对象下的指定同名方法
        const res = this[item]()
        if (typeof res === 'object') {
          Object.assign(query, res)
        }
      } else if (typeof item === 'function') {
        // 如果是函数，则直接执行该函数
        const res = item()
        if (typeof res === 'object') {
          Object.assign(query, res)
        }
      }
    }
  }

  const options = {
    method: 'GET',
    url,
    params: query,
  }

  const { data: responseData } = await request(options)

  this.setData({
    [pageDataName]: responseData,
  })

  if (responseDataHandler && typeof responseDataHandler === 'function') {
    responseDataHandler(responseData, this)
  }

  return responseData
}

module.exports = bindRequestData
