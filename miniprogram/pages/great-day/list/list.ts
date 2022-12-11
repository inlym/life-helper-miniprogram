// pages/great-day/list/list.ts

import {PageChannelEvent} from '../../../app/core/constant'
import {GreatDay, listGreatDay} from '../../../app/services/great-day'
import {TapEvent} from '../../../app/utils/types'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    // ============================= 从HTTP请求获取的数据 =============================

    /** 纪念日列表 */
    list: [] as GreatDay[],
  },

  behaviors: [themeBehavior],

  onLoad() {
    this.init()
  },

  /** 页面初始化方法 */
  async init() {
    const list = await listGreatDay()
    this.setData({list})
  },

  /** 跳转到“编辑”页 */
  goToEditPage() {
    const self = this
    wx.navigateTo({
      url: '/pages/great-day/edit/edit',
      events: {
        [PageChannelEvent.REFRESH_DATA]: function () {
          self.init()
        },
      },
    })
  },

  /** 跳转到“详情”页 */
  goToDetailPage(e: TapEvent<{id: string}>) {
    const self = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/great-day/detail/detail?id=${id}`,
      events: {
        [PageChannelEvent.REFRESH_DATA]: function () {
          self.init()
        },
      },
    })
  },
})
