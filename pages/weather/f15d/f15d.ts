import { ResourceUrl } from '../../../app-new/core/resources'

Page({
  data: {
    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** scroll-view 的当前居首项 ID */
    scrollIndex: 's-0',

    // 静态图片地址
    imageUrl4Wind: ResourceUrl['f15d-wind'],

    imageUrl4Sunrise: ResourceUrl['f15d-sunrise'],
    imageUrl4Moon: ResourceUrl['f15d-moon'],
  },

  // requested: {
  //   fore15d: {
  //     url: '/weather/15d',
  //     params(query) {
  //       return { id: query.id }
  //     },
  //     handler(data) {
  //       const { date } = this.query()
  //       if (date) {
  //         const index = data.list.findIndex((item) => item.date === date) || 0
  //         this.show(index)
  //       }
  //     },
  //   },
  // },

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
  handleScorllItemTap(event: any) {
    const { index } = event.currentTarget.dataset
    this.show(index)
  },
})
