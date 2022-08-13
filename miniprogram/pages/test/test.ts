// pages/test/test.ts

import {requestForData} from '../../app/core/http'
import {themeBehavior} from '../../behaviors/theme-behavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
  },

  behaviors: [themeBehavior],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    requestForData({
      method: 'GET',
      url: '/login/qrcode',
    }).then((res) => {
      this.setData({imageUrl: res.url})
    })
  },
})
