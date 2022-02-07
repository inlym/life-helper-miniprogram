import { sharedInit } from '../../../app/core/shared-init'
import { Diary, getDiaryList } from '../../../app/services/diary.service'

Page({
  data: {
    list: [] as Diary[],
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)

    const list = await getDiaryList()
    this.setData({ list })
  },

  onLoad() {
    this.init('onLoad')
  },
})
