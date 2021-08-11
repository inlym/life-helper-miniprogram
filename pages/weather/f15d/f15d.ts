import { ResourceUrl } from '../../../app/core/resources'
import { sharedInit } from '../../../app/core/shared-init'
import { TapEvent } from '../../../app/core/wx.interface'

/** 页面入参 */
interface PageQuery {
  /** 和风天气的 LocationId */
  id?: string

  /** `2021-08-10` 格式的日期 */
  date?: string
}

Page({
  data: {
    /** 入参日期 */
    date: '',

    list: [],

    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** scroll-view 的当前居首项 ID */
    scrollIndex: 's-0',

    // 静态图片地址
    imageUrl4Wind: ResourceUrl['f15d-wind'],

    imageUrl4Sunrise: ResourceUrl['f15d-sunrise'],
    imageUrl4Moon: ResourceUrl['f15d-moon'],
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)

    if (eventName === 'onLoad' && this.data.date) {
      const index = this.data.list.findIndex((item: any) => item.date === this.data.date)
      if (index !== undefined) {
        this.show(index)
      }
    }
  },

  onLoad(query: PageQuery) {
    this.setData(query)

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('data', (data) => {
      this.setData({ list: data })
    })

    this.init('onLoad')
  },

  onPullDownRefresh() {
    this.init('onPullDownRefresh')
  },

  /** 展示指定索引的项目 */
  show(index: number) {
    if (index === 0 || index === 1) {
      this.setData({
        scrollIndex: 's-0',
        currentIndex: index,
      })
    } else {
      this.setData({
        scrollIndex: `s-${index - 2}`,
        currentIndex: index,
      })
    }
  },

  /** swiper 滑块滑动事件处理 */
  handleSwiperChange(event: any) {
    const { current: index, source } = event.detail
    if (source === 'touch') {
      this.show(index)
    }
  },

  /** 处理 scroll-view 中元素点击 */
  handleScorllItemTap(event: TapEvent) {
    const { index } = event.currentTarget.dataset
    this.show(index)
  },
})
