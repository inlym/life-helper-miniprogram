'use strict'

const { CustomPage } = getApp()
const { updateUserInfo } = require('../../app/services/userinfo')

CustomPage({
  data: {
    list1: [
      {
        name: '我的设备',
        url: '/pages/system/info/info',
        icon: 'https://img.lh.inlym.com/icon/keyboard.png',
      },
    ],
    list2: [
      {
        name: '关于',
        url: '/pages/about/about',
        icon: 'https://img.lh.inlym.com/icon/keyboard.png',
      },
    ],
  },

  requested: {
    userInfo: {
      url: '/userinfo',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** 生命周期函数--监听页面显示 */
  onShow() {},

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {},

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** * 用户点击右上角分享 */
  onShareAppMessage() {},

  /** 页面初始化 */
  init() {},

  onUpdateButtonTap() {
    updateUserInfo()
  },
})
