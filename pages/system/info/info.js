'use strict'

// pages/system/info/info.js
const app = getApp()

Page({
  /** 页面的初始数据 */
  data: {
    /** 设备品牌 */
    brand: '',

    /** 设备型号 */
    model: '',

    /** 设备像素比 */
    pixelRatio: 0,

    /** 屏幕宽度，单位px */
    screenWidth: 0,

    /** 屏幕高度，单位px */
    screenHeight: 0,

    /** 可使用窗口宽度，单位px */
    windowWidth: 0,

    /** 可使用窗口高度，单位px */
    windowHeight: 0,

    /** 状态栏的高度，单位px */
    statusBarHeight: 0,

    /** 微信设置的语言 */
    language: '',

    /** 微信版本号 */
    version: '',

    /** 操作系统及版本 */
    system: '',

    /** 客户端平台 */
    platform: '',

    /** 用户字体大小 */
    fontSizeSetting: '',

    /** 客户端基础库版本 */
    SDKVersion: '',

    /** 设备性能等级 */
    benchmarkLevel: '',
  },

  /** 页面初始化 */
  init() {
    const res = wx.getSystemInfoSync()
    this.setData(res)

    app.logger.debug('测试 debug 日志')
    app.logger.info('测试 info 日志')
    app.logger.warn('测试 warn 日志')
    app.logger.error('测试 error 日志')
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    this.init()
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** 生命周期函数--监听页面显示 */
  onShow() {},

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    this.init()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** * 用户点击右上角分享 */
  onShareAppMessage() {},
})
