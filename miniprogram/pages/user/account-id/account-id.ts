// pages/user/account-id/account-id.ts

import {getUserInfo} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 账户 ID */
    accountId: 0,
  },

  behaviors: [themeBehavior],

  /** 页面初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({accountId: userInfo.accountId})
  },

  onLoad() {
    this.init()
  },

  /** 复制账户 ID */
  copy() {
    const accountId = this.data.accountId

    wx.vibrateShort({type: 'medium'})
    wx.setClipboardData({data: accountId + ''})
  },
})
