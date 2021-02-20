'use strict'

/**
 * 对原生 Storage 相关操作的简单封装，然后挂载到 app 实例上
 * @since 2021-02-05
 * @update 2021-02-20
 */

module.exports = {
  set(key, value) {
    wx.setStorageSync(key, value)
  },

  write(key, value) {
    wx.setStorageSync(key, value)
  },

  get(key) {
    return wx.getStorageSync(key)
  },

  read(key) {
    return wx.getStorageSync(key)
  },

  del(key) {
    wx.removeStorageSync(key)
  },
}
