'use strict'

/**
 * 对原生 Storage 相关操作的简单封装，然后挂载到 app 实例上
 * @since 2021-02-05
 * @update 2021-02-22
 */

/** 用于记录保存时间的键名前缀 */
const TIME_PREFIX = '__time__/'

module.exports = {
  set(key, value) {
    wx.setStorageSync(key, value)
    wx.setStorageSync(`${TIME_PREFIX}${key}`, new Date().getTime())
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

  time(key) {
    return wx.getStorageSync(`${TIME_PREFIX}${key}`)
  },
}
