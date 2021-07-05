'use strict'

const { CustomPage, getResUrl } = getApp()
const { updateUserInfo } = require('../../app/services/userinfo')
const { reset } = require('../../app/services/system')

CustomPage({
  data: {
    logoUrl: getResUrl('logo'),
  },

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

  /**
   * 点击 “一键修复” 按钮
   */
  async recover() {
    reset()
  },
})
