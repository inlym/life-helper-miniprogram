import { sharedInit } from '../../app/core/shared-init'

Page({
  /** 页面的初始数据 */
  data: {},

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)
  },

  onLoad() {
    this.init('onLoad')
  },

  onPullDownRefresh() {
    this.init('onPullDownRefresh')
  },
})
