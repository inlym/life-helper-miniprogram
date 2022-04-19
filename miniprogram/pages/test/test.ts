// pages/test/test.ts

import {mixedBehavior} from '../../behaviors/mixed-bahavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  behaviors: [mixedBehavior],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.one()
  },

  one() {
    console.log(wx.getSystemInfoSync())
  },
})
