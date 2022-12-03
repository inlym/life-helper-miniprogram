// pages/system/error/error.ts

import {login} from '../../../app/core/auth'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// 页面用途
// 当出现一些异常难以处理时，直接跳转到这个页面，然后让用户重试操作。

Page({
  data: {},

  behaviors: [themeBehavior],

  /**
   * 页面初始化方法
   */
  init() {
    // 清除所有缓存
    wx.clearStorageSync()

    // 重新登录一次
    login()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init()
  },

  /**
   * 跳转到首页
   */
  goToIndexPage() {
    wx.switchTab({url: '/pages/index/index'})
  },
})
