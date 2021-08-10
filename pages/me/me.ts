import { ResourceUrl } from '../../app/core/resources'
import { getUserInfo, updateUserInfo } from '../../app/services/user-info.service'
import { reset } from '../../app/services/system.service'
import { version } from '../../app/core/version'

Page({
  data: {
    logoUrl: ResourceUrl.logo,
    version: version,
  },

  async init() {
    const data = await getUserInfo()
    this.setData({ userInfo: data })
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

  onLoad() {
    this.init()
  },

  onPullDownRefresh() {
    this.init()
  },
})
