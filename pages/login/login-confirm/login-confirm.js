'use strict'

const { CustomPage } = getApp()

CustomPage({
  data: {
    /** 是否已登录 */
    hasLogined: false,
  },

  computed: {},

  requested: {},

  onLoad() {},

  /**
   * 确认登录
   */
  confirm() {
    this.setData({
      hasLogined: true,
    })
  },

  /**
   * 返回首页
   */
  backToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },
})
