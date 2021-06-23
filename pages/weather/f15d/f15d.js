'use strict'

const { CustomPage, getResUrl } = getApp()

CustomPage({
  data: {
    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** scroll-view 的当前居首项 ID */
    scrollIndex: 's-0',

    imageUrl4Wind: getResUrl('f15d-wind'),
    imageUrl4Sunrise: getResUrl('f15d-sunrise'),
    imageUrl4Moon: getResUrl('f15d-moon'),
  },

  requested: {
    fore15d: {
      url: '/weather/15d',
      params(query) {
        return { id: query.id }
      },
      handler(data) {
        const { date } = this.query()
        if (date) {
          this.setData({ currentIndex: data.list.findIndex((item) => item.date === date) || 0 })
        }
      },
    },
  },

  onLoad() {},

  /** 在获取到页面数据后执行， */
  afterGetData() {
    const { date } = this.getQuery()
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
