// pages/great-day/detail/detail.ts

import {PageChannelEvent} from '../../../app/core/constant'
import {getGreatDayDetail, GreatDay} from '../../../app/services/great-day'
import {Id} from '../../../app/utils/types'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    // ================================ 页面传值数据 ================================

    /**
     * 纪念日 ID
     *
     * ### 说明
     * 该值从路径参数获取，必须包含该值，否则报错。
     */
    id: '',

    // ============================= 从HTTP请求获取的数据 =============================

    /** 纪念日详情数据 */
    day: {} as GreatDay,
  },

  behaviors: [themeBehavior],

  onLoad(query: Record<string, string | undefined>) {
    const id = (query as unknown as Id).id
    this.setData({id})

    this.init()
  },

  /** 页面初始化方法 */
  async init() {
    const id = this.data.id
    const day = await getGreatDayDetail(id)
    this.setData({day})

    wx.setNavigationBarTitle({title: day.name})
  },

  /** 通知前一个页面（列表页）刷新 */
  notifyListPageRefresh() {
    const channel = this.getOpenerEventChannel()
    if (typeof channel.emit === 'function') {
      channel.emit(PageChannelEvent.REFRESH_DATA)
    }
  },

  /** 跳转到“编辑”页 */
  goToEditPage() {
    const self = this
    const {id, day} = this.data
    wx.navigateTo({
      url: `/pages/great-day/edit/edit?id=${id}`,
      events: {
        [PageChannelEvent.REFRESH_DATA]: function () {
          self.init()
          self.notifyListPageRefresh()
        },
      },
    }).then((res) => {
      res.eventChannel.emit(PageChannelEvent.DATA_TRANSFER, {day})
    })
  },
})
