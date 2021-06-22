'use strict'

const { CustomPage } = getApp()
const { updateUserInfo } = require('../../app/services/userinfo')

CustomPage({
  data: {},

  requested: {
    userInfo: {
      url: '/userinfo',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  onUpdateButtonTap() {
    updateUserInfo().then((res) => {
      this.setData({
        userInfo: res,
      })
    })
  },
})
