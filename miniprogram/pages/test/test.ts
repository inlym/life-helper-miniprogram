// pages/test/test.ts
import { http } from '../../app/core/http'

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
    // login().then(console.log)
    http.get('/userinfo').then(console.log)
  },
})
