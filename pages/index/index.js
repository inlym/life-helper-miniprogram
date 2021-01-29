'use strict'

const app = getApp()

Page({
  /** 页面的初始数据 */
  data: {
    weatherCondition: {
      temperature: '0',
      location: '正在定位中 ...',
    },

    /** Toptips顶部错误提示组件 */
    toptip: {
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
          msg: '哇哦！已经更新了哦 ~',
        },
      })
    }, 1000)
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** 用户点击右上角分享 */
  onShareAppMessage() {
    const imageUrl = 'https://img.lh.inlym.com/share/index_share.jpeg'
    const title = '[来自好友推荐] 好友评价：十分实用，页面也很好看，推荐给你'
    const path = '/pages/index/index'
    return {
      imageUrl,
      title,
      path,
    }
  },

  /** 用户点击右上角菜单“分享到朋友圈”按钮 */
  onShareTimeline() {
    const title = '[来自好友推荐] 好友评价：五星好评的智能生活助手'
  },

  /** 页面初始化 */
  init() {
    this.getWeatherCondition()
  },

  /** 获取天气实况 */
  async getWeatherCondition() {
    const res = await app.get('/weather/now')
    this.setData({
      weatherCondition: res.data,
    })
  },
})
