'use strict'

const keys = require('../../../config/keys.js')

/**
 * 页面加载时检查是否已获取登录凭证，如果没有登录那么登录一次（仅作为一种补充，非强验证）
 * @since 2021-03-25
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 执行时间应在重定义原生方法后，页面 onLoad 前（仅执行一次即可，无需绑定到页面方法）
 */
module.exports = async function checkLogin() {
  const key = keys.STORAGE_TOKEN_FIElD
  const res = wx.getStorageSync(key)
  if (res) {
    return true
  } else {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      this.login().then(() => {
        return true
      })
    }
  }
}
