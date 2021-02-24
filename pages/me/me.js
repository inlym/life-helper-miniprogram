'use strict'

const app = getApp()
const { CustomPage } = app
const { updateUserInfo } = require('../../app/common/user.js')

CustomPage({
  /** 页面的初始数据 */
  data: {
    /** 顶部预留的高度，不放置任何内容 */
    reservedHeight: 80,

    /** Toptips顶部错误提示组件 */
    toptips: {
      type: 'success',
      show: false,
      msg: '',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {
    // this.init()
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    this.setreservedHeight()
  },

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
      this.setData({
        toptip: {
          type: 'success',
          show: true,
          msg: '哇！页面数据已经更新了哦 ~',
        },
      })
    }, 1000)
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** * 用户点击右上角分享 */
  onShareAppMessage() {},

  /** 页面初始化 */
  init() {},

  /** 设置顶部预留高度 */
  setreservedHeight() {
    const { bottom } = wx.getMenuButtonBoundingClientRect()
    this.setData({
      reservedHeight: bottom,
    })
  },

  onUpdateButtonTap() {
    updateUserInfo()
  },
})
