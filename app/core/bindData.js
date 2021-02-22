'use strict'

const { request } = require('./request.js')

/**
 * 绑定页面数据与接口数据
 * @since 2021-02-19
 * @param {object} page 页面注册函数 Page 调用对象的 this，调用时填入 this 即可
 * @param {string} pageDataName 在 data 内的变量名
 * @param {string} url 请求的 URL，不包含 query（查询字符串） 部分
 * @param  {...function} queryHandlerList query（查询字符串）处理函数列表，为空则调用 page._query
 */
async function bindData(page, pageDataName, url, ...queryHandlerList) {
  /** 查询字符串对象 */
  const query = {}

  if (queryHandlerList.length === 0 && page._query && typeof page._query === 'function') {
    const res = page._query()
    if (typeof res === 'object') {
      Object.assign(query, res)
    } else {
      // 空
    }
  } else {
    for (let i = 0; i < queryHandlerList.length; i++) {
      const res = queryHandlerList[i]()
      if (typeof res === 'object') {
        Object.assign(query, res)
      } else {
        // 空
      }
    }
  }

  const options = {
    method: 'GET',
    url,
    params: query,
  }

  const { data } = await request(options)

  page.setData({
    [pageDataName]: data,
  })

  return data
}

module.exports = bindData
