// pages/weather/living/living.ts
import {themeBehavior} from '../../../behaviors/theme-behavior'
import {LivingIndex} from '../../../app/services/weather-data'
import {PageChannelEvent} from '../../../app/core/constant'
import {TapEvent} from '../../../app/utils/types'

Page({
  data: {
    // -----------------------------  从上个页面带来的数据  -----------------------------

    /** 生活指数列表 */
    indices: [] as LivingIndex[],

    /** 首要展示的指数类型，即默认选中该项 */
    type: '',

    // ------------------------------  页面状态管理数据  ------------------------------

    /** 当前活跃索引 */
    activeIndex: 0,
  },

  behaviors: [themeBehavior],

  onLoad() {
    // 获取从上个页面的传值
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)
      })
    }

    this.init()
  },

  /** 页面初始化 */
  init() {
    const activeType = this.data.type ?? ''

    this.setActiveIndex(activeType)
  },

  /**
   * 处理顶部区域点击事件
   */
  handleHeadItemTap(e: TapEvent<{type: string}>) {
    const type = e.currentTarget.dataset.type
    this.setActiveIndex(type)
  },

  /**
   * 处理滑块切换事件
   */
  handleSwiperItemChange(e: WechatMiniprogram.SwiperChange) {
    if (e.detail.source === 'touch') {
      this.setData({activeIndex: e.detail.current})
    }
  },

  /**
   * 通过指数类型找到它在列表中的索引（如果未找到则返回 0），然后定义活跃索引
   *
   * @param type 指数类型
   */
  setActiveIndex(type: string): void {
    const index = this.data.indices.findIndex((item) => item.type === type)
    const activeIndex = index > 0 ? index : 0
    this.setData({activeIndex})
  },
})
