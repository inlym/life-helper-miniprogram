// pages/user/avatar/avatar.ts
// 头像预览页

import {getUserInfo, updateAvatar} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 头像图片的 URL 地址 */
    avatarUrl: '',
  },

  behaviors: [themeBehavior],

  /** 页面初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({avatarUrl: userInfo.avatarUrl})
  },

  onShow() {
    this.init()
  },

  /** 处理选择头像事件 */
  async handleChooseAvatar(e: WechatMiniprogram.CustomEvent<{avatarUrl: string}>) {
    const avatarUrl = e.detail.avatarUrl
    await updateAvatar(avatarUrl)

    this.init()
  },
})
