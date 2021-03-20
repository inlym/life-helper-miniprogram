'use strict'

/**
 * 将页面 data 中的变量与指定请求返回数据绑定，即打包完成以下事项：
 * 1. 发送请求
 * 2. 接收响应
 * 3. 将响应数据赋值
 * 4. 如定义了响应处理函数则一并执行
 *
 * @since 2021-02-27
 * @this WechatMiniprogram.Page.Instance
 * @param {string} name 在 data 中的变量名
 * @param {string} url 请求的 URL，不包含 query（查询字符串） 部分
 * @param {?Object} query 查询字符串对象
 * @param {?Function} handler 处理响应数据的函数
 */
module.exports = async function bindResponseData(name, url, query, handler) {
  if (!name || !url) {
    throw new Error('name 或 url 参数为空！')
  }

  query = query || {}

  const options = {
    method: 'GET',
    url,
    params: query,
  }

  const { data: responseData } = await this.request(options)

  this.setData({
    [name]: responseData,
  })

  if (handler) {
    if (typeof handler === 'function') {
      handler.call(this, responseData)
    } else if (typeof handler === 'string') {
      if (this[handler] && typeof this[handler] === 'function') {
        this[handler]()
      } else {
        throw new Error(`${name} 请求任务对应的 handler 不存在`)
      }
    } else {
      throw new Error('暂不支持的 handler 参数')
    }
  }

  return responseData
}
