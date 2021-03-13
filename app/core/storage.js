'use strict'

/**
 * 对原生 Storage 相关操作的简单封装，然后挂载到 app 实例和页面上
 * @since 2021-02-05
 * @update 2021-02-22, 2021-03-13
 */

module.exports = {
  set(key, value) {
    wx.setStorageSync(key, value)
  },

  get save() {
    return this.set
  },

  get write() {
    return this.set
  },

  get(key) {
    return wx.getStorageSync(key)
  },

  get read() {
    return this.get
  },

  del(key) {
    wx.removeStorageSync(key)
  },
}
