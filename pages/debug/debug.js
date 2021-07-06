'use strict'

const config = require('../../app/config')
const { STO_TOKEN } = require('../../app/core/constants')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 当前是否开启调试模式 */
    debugStatus: false,

    /** 配置文件内容 */
    config: config,

    /** 登录凭证 */
    token: '',
  },

  /** 页面初始化方法 */
  init() {
    this.getDebugStatus()
    this.getToken()
  },

  onLoad() {
    this.init()
  },

  onPullDownRefresh() {
    this.init()
  },

  /** 获取当前调试模式状态（是否开启） */
  getDebugStatus() {
    const result = wx.getSystemInfoSync()
    this.setData({
      debugStatus: result.enableDebug,
    })
  },

  enableDebug() {
    wx.setEnableDebug({ enableDebug: true })
    this.setData({ debugStatus: true })
  },

  disableDebug() {
    wx.setEnableDebug({ enableDebug: false })
    this.setData({ debugStatus: false })
  },

  getToken() {
    const token = wx.getStorageSync(STO_TOKEN)
    this.setData({
      token: token || '[empty]',
    })
  },

  /** 复制 token */
  copyToken() {
    const token = this.data.token
    wx.setClipboardData({ data: token })
  },
})
