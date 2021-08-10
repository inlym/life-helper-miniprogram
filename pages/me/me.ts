import { ResourceUrl } from '../../app/core/resources'
import { getUserInfo, updateUserInfo } from '../../app/services/user-info.service'
import { reset } from '../../app/services/system.service'
import { version } from '../../app/core/version'
import { sharedInit } from '../../app/core/shared-init'

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
    this.setData({ userInfo: res })
  },

  /** 点击一键恢复 */
  recover() {
    reset()
  },
})
