// pages/test/test.ts

import { getMixedWeatherData } from '../../app/services/weather'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: 'mark',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //
  },

  one() {
    getMixedWeatherData({ longitude: 120, latitude: 30 }).then(console.log)
  },
})
