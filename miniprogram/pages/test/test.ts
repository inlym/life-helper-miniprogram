// pages/test/test.ts

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //
  },

  one() {
    wx.getUserCryptoManager().getLatestUserKey({
      success: (res) => {
        console.info('getLatestUserKey', res)
      },
      fail: (err) => {
        console.error('getLatestUserKey', err)
      },
    })
  },
})
