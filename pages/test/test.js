'use strict'

const app = getApp()
const { CustomPage } = app
const request = require('../../app/core/request.js')
const jshttp = require('jshttp')

CustomPage({
  /** 页面的初始数据 */
  data: {},

  requested: {},

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

  temp() {
    this.post({
      url: '/debug/auth',
      data: {
        name: 'amrk',
      },
    }).then((res) => {
      console.log('userId =>', res.data.userId)
    })
  },

  temp2() {
    this.httpClient.login().then(console.log)
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    jshttp({
      method: 'get',
      url: 'https://api.lh.inlym.com/weather/15d',
      // params: {
      //   name: 'mark',
      //   age: 19,
      // },
      headers: {
        ttadsf: 'asdfasdf',
        Authorization: 'token 64ca8e7b09434e2b9b325f65cf028bef',
      },
      signature: {
        key: '203922296',
        secret: '6AHikmExGw6h8XLx3jNdXhgSyd3uoZcF',
      },

      // data: {
      //   name: 'mark',
      //   age: 22,
      // },
    }).then((res) => {
      console.log(res.data)
    })
  },

  temp3() {
    this.request({ url: '/debug/temp' }).then(console.log)
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
  onPullDownRefresh() {},

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},
})
