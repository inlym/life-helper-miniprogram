'use strict'

const app = getApp()
const { CustomPage } = app
const { updateUserInfo } = require('../../app/common/user.js')

CustomPage({
  /** 页面的初始数据 */
  data: {},

  computed: {
    hasUserInfo(data) {
      return Boolean(data.userInfo.nickname)
    },
  },

  requested: {
    userInfo: {
      url: '/user/info',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {},

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

  onUpdateButtonTap() {
    updateUserInfo().then(() => {
      this._init()
    })
  },

  test() {
    this.updateData({
      userInfo: {
        nickname: '',
      },
    })
  },
})
