// pages/me/me.ts

import {getVersion} from '../../app/core/system'
import {getUserInfo, UserInfo} from '../../app/services/userinfo'
import {shareAppBehavior} from '../../behaviors/share-app-behavior'
import {themeBehavior} from '../../behaviors/theme-behavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 用户资料 */
    userInfo: {} as UserInfo,

    /** 当前的版本号 */
    version: '',
  },

  behaviors: [themeBehavior, shareAppBehavior],

  /**
   * 页面初始化方法
   */
  async init() {
    const userInfo = await getUserInfo()
    const version = getVersion()
    this.setData({userInfo, version})
  },

  onShow() {
    this.init()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.init()
  },

  /** 监听头像的图片加载完成 */
  onAvatarLoad() {
    this.animate(
      '.avatar',
      [
        {offset: 0, scale: [1], rotateX: 0},
        {offset: 0.5, scale: [0.9], rotateX: 180},
        {offset: 1, scale: [1], rotateX: 0},
      ],
      700,
      () => {
        this.clearAnimation('.avatar', {scale: true})
      }
    )
  },

  /** 跳转到【个人信息】页面 */
  goToUserInfoPage() {
    wx.navigateTo({url: '/pages/user/user-info/user-info'})
  },

  /** 跳转到版本信息页 */
  goToVersionPage() {
    wx.navigateTo({url: '/pages/about/main/main'})
  },
})
