'use strict'

const { CustomPage } = getApp()

CustomPage({
  /** 页面的初始数据 */
  data: {
    /** 相册列表 */
    albums: {
      count: 0,
      list: [],
    },
  },

  computed: {},

  requested: {
    albums: {
      url: '/albums',
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

  /**
   * 点击 “创建相册” 按钮
   */
  createAlbum() {
    wx.navigateTo({ url: '/pages/album/edit/edit' })
  },
})
