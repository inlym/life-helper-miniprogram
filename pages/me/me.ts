import { ResourceUrl } from '../../app/core/resources'
import { sharedInit } from '../../app/core/shared-init'
import { version } from '../../app/core/version'
import { reset } from '../../app/services/system.service'
import { getUserInfo, updateUserInfo } from '../../app/services/user-info.service'

Page({
  data: {
    logoUrl: ResourceUrl.logo,
    version: version,
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)

    const data = await getUserInfo()
    this.setData({ userInfo: data })
  },

  onLoad() {
    this.init('onLoad')
  },

  onPullDownRefresh() {
    this.init('onPullDownRefresh')
  },

  /** 点击 “更新” 按钮 */
  async onUpdateButtonTap() {
    const res = await updateUserInfo()
    if (res) {
      this.setData({ userInfo: res })
    }
  },

  /** 点击一键恢复 */
  recover() {
    reset()
  },

  goToDiary() {
    wx.navigateTo({ url: '/pages/diary/create/create' })
  },
})
