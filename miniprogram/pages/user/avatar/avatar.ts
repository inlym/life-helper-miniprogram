// pages/user/avatar/avatar.ts
// 头像预览页

import {PageChannelEvent} from '../../../app/core/constant'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 头像图片的 URL 地址 */
    avatarUrl: '',
  },

  behaviors: [themeBehavior],

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    // 第一次加载页面，数据由上个页面带过来
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)
      })
    }
  },

  /** 处理选择头像事件 */
  handleChooseAvatar(e: WechatMiniprogram.CustomEvent<{avatarUrl: string}>) {
    const avatarUrl = e.detail.avatarUrl
    this.setData({avatarUrl})
  },
})
