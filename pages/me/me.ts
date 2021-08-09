import { ResourceUrl } from '../../app/core/resources'
import { getUserInfo, updateUserInfo } from '../../app/services/user-info.service'
import { reset } from '../../app/services/system.service'

Page({
  data: {
    logoUrl: ResourceUrl.logo,
    version: '0.3.0',
  },

  async init() {
    const data = await getUserInfo()
    this.setData({ userInfo: data })
  },

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
