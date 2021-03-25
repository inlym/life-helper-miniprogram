'use strict'

const app = getApp()
const { CustomPage } = app
const CryptoJS = require('../../app/ext/crypto-js.min.js')
const { base64 } = require('../../app/apps.js')

CustomPage({
  /** 页面的初始数据 */
  data: {},

  requested: {
    token: {
      url: '/oss/token',
      queries: 'qs1',
    },
  },

  qs1() {
    return { n: 2 }
  },

  debug: {
    configuration: true,
    setData: true,
    request: true,
  },

  choose() {
    const ossToken = this.data.token.list[0]
    const self = this

    wx.chooseImage({
      count: 1,
      success(res) {
        const filePath = res.tempFilePaths[0]
        self.httpClient.uploadSingleImageToOss({ ossToken, filePath }).then(console.log)
      },
    })
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
})
