// pages/test/test.ts
import { getUserInfo } from '../../app/services/userinfo'

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
    getUserInfo().then(console.log)
  },
})
