import {getUserInfo, UserInfo} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/user/user-info/user-info.ts
Page({
  data: {
    /** 用户资料 */
    userInfo: {} as UserInfo,
  },

  behaviors: [themeBehavior],

  /** 初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({userInfo})
  },

  // 由于这几个页面经常往返跳转，因此简化处理，每次展示页面都直接刷新数据（从缓存中读取）
  onShow() {
    this.init()
  },

  /** 跳转到【头像预览】页 */
  goToAvatarPage() {
    wx.navigateTo({url: '/pages/user/avatar/avatar'})
  },

  /** 跳转到【设置昵称】页 */
  goToNickNamePage() {
    wx.navigateTo({url: '/pages/user/nick-name/nick-name'})
  },
})
