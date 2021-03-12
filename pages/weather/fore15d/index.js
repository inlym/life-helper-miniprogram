'use strict'

const { CustomPage } = getApp()

CustomPage({
  data: {
    currentIndex: 0,
    scrollIndex: 's-0',
  },

  computed: {},

  requested: {
    fore15d: {
      url: '/weather/15d',
      queries: 'qs',
    },
  },

  debug: {
    configuration: true,
    setData: true,
    request: true,
  },

  qs() {
    const { location } = this.getLoadOptions()
    return { location }
  },

  onLoad() {},

  onReady() {},

  onShow() {},

  onReachBottom() {},

  onShareAppMessage() {},

  /** swiper 滑块滑动事件处理 */
  handleSwiperChange(event) {
    const { current: index } = event.detail
    this.setData({
      currentIndex: index,
    })
    if (index === 0 || index === 1) {
      this.setData({
        scrollIndex: 's-0',
      })
    } else {
      this.setData({
        scrollIndex: `s-${index - 2}`,
      })
    }
  },

  /** 处理 scroll-view 中元素点击 */
  handleScorllItemTap(event) {
    const { index } = event.currentTarget.dataset
    this.setData({
      currentIndex: index,
    })
    if (index === 0 || index === 1) {
      this.setData({
        scrollIndex: 's-0',
      })
    } else {
      this.setData({
        scrollIndex: `s-${index - 2}`,
      })
    }
  },
})
