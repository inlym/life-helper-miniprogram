// pages/test/test.ts

import {themeBehavior} from '../../app/core/theme'

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  behaviors: [themeBehavior],

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
