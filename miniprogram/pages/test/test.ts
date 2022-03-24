// pages/test/test.ts

import { getUserInfo, updateUserInfo } from '../../app/services/userinfo'

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

  one() {
    wx.getUserProfile({
      desc: '自定义文字提示',
    }).then(res => {
      const nickName = res.userInfo.nickName
      const avatarUrl = res.userInfo.avatarUrl
      updateUserInfo({ nickName, avatarUrl }).then(console.log)
    })
  },
})
