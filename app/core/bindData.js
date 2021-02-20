'use strict'

const { request } = require('./request.js')

/**
 * 绑定页面数据与接口数据
 * @since 2021-02-19
 * @this Page
 * @param {object} page 页面注册函数 Page 调用对象的 this
 * @param {string} variableName 变量名
 * @param {string} url 接口的 URL
 * @param {?function} queryHandler 查询字符串处理器，若为空，则自动取页面同名方法
 */
async function bindData(page, variableName, url, queryHandler) {
  const requestOptions = {
    method: 'GET',
    url,
  }

  if (queryHandler && typeof queryHandler === 'function') {
    requestOptions.params = queryHandler()
  } else if (page.queryHandler && typeof page.queryHandler === 'function') {
    requestOptions.params = page.queryHandler()
  }

  const { data } = await request(requestOptions)

  if (data.list) {
    page.setData({
      [variableName]: data.list,
    })
  } else {
    page.setData({
      [variableName]: data,
    })
  }

  return data
}

module.exports = bindData
