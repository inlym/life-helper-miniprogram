'use strict'

const { CustomPage } = getApp()

CustomPage({
  data: {
    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** scroll-view 的当前居首项 ID */
    scrollIndex: 's-0',
  },

  requested: {
    fore15d: {
      url: '/weather/15d',
      queries: 'qs1',
    },
  },

  debug: {
    configuration: true,
    setData: true,
    request: true,
  },

  qs1() {
    const { location } = this.getQuery()
    return { location }
  },

  onLoad() {
    const { date, transfer } = this.getQuery()
    if (date) {
      const { list } = this.data.fore15d
      for (let i = 0; i < list.length; i++) {
        if (list[i]['date'] === date) {
          this.show(i)
          break
        }
      }
    }
  },

  /** 展示指定索引的项目 */
  show(index) {
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
  handleSwiperChange(event) {
    const { current: index, source } = event.detail
    if (source === 'touch') {
      this.show(index)
    }
  },

  /** 处理 scroll-view 中元素点击 */
  handleScorllItemTap(event) {
    const { index } = event.currentTarget.dataset
    this.show(index)
  },
})
