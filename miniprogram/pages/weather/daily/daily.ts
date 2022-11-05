import {TapEvent} from '../../../app/utils/types'
import {themeBehavior} from '../../../behaviors/theme-behavior'
import {WeatherDaily} from '../../../app/services/weather-data'

// pages/weather/daily/daily.ts
Page({
  data: {
    // -----------------------------  从上个页面带来的数据  -----------------------------

    /** 未来15天预报数据 */
    f15d: [] as WeatherDaily[],

    /** 选中的日期 */
    date: '',

    /** 地点名称 */
    locationName: '',

    // -------------------------------  页面状态管理数据  -------------------------------

    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** 置于最前面的滚动视图项目 */
    activeScrollItemId: 's-0',
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('transferData', (data) => {
      this.setData(data)
    })
  },

  onReady() {
    const title = this.data.locationName
    wx.setNavigationBarTitle({title})

    const index = this.data.f15d.findIndex((item: WeatherDaily) => item.date === this.data.date)
    this.show(index)
  },

  /** 处理滚动条点击事件 */
  handleScrollItemTap(event: TapEvent<{index: number}>) {
    const index = event.currentTarget.dataset.index
    this.show(index)
  },

  /** 处理滑块切换事件 */
  handleSwiperChange(event: any) {
    const {current, source} = event.detail
    if (source === 'touch') {
      this.show(current)
    }
  },

  /** 展示指定索引项目 */
  show(index: number) {
    if (index === 0 || index === 1) {
      this.setData({
        currentIndex: index,
        activeScrollItemId: 's-0',
      })
    } else {
      this.setData({
        currentIndex: index,
        activeScrollItemId: `s-${index - 2}`,
      })
    }
  },
})
