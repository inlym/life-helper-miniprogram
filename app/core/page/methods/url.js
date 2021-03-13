'use strict'

/** 在 data 中存储 url 的字段名 */
const field = '__page_url__'

/**
 * 从页面栈获取并存储当前页面的 URL
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 执行时间应在重定义原生方法后，页面 onLoad 前（仅执行一次即可，无需绑定到页面方法）
 */
function savePageUrl() {
  const list = getCurrentPages()
  const { route } = list[list.length - 1]
  this._originalSetData({
    [field]: route,
  })
}

/**
 * 获取当前页面的 URL
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 该方法绑定至页面方法上
 */
function getUrl() {
  return this.data[field]
}

module.exports = {
  savePageUrl,
  getUrl,
}
