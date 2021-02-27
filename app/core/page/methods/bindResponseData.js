'use strict'

const { request } = require('../../request.js')

/**
 * 将页面 data 中的变量与指定请求返回数据绑定，即打包完成以下事项：
 * 1. 发送请求
 * 2. 接收响应
 * 3. 将响应数据赋值
 * 4. 如定义了响应处理函数则一并执行
 *
 * @since 2021-02-27
 * @this
 * @param {string} name 在 data 中的变量名
 * @param {string} url 请求的 URL，不包含 query（查询字符串） 部分
 * @param {?Object} query 查询字符串对象
 * @param {?Function} handler 处理响应数据的函数
 */
module.exports = async function bindRequestData(name, url, query, handler) {
  if (!name || !url) {
    throw new Error('name 或 url 参数为空！')
  }

  query = query || {}

  const options = {
    method: 'GET',
    url,
    params: query,
  }

  const { data: responseData } = await request(options)

  this.setData({
    [name]: responseData,
  })

  if (handler && typeof handler === 'function') {
    handler(responseData, this)
  }

  return responseData
}
