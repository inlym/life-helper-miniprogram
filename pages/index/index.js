'use strict'

const { CustomPage } = getApp()

CustomPage({
  /** 页面的初始数据 */
  data: {},

  requested: {
    main: {
      url: '/weather?token=86fbf96ab2ca4899805a67beee428f21',
    },
  },

  computed: {},

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

  addCity() {},
})
