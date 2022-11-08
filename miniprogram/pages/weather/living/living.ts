// pages/weather/living/living.ts
import {themeBehavior} from '../../../behaviors/theme-behavior'
import {LivingIndex} from '../../../app/services/weather-data'
import {PageChannelEvent} from '../../../app/core/constant'

Page({
  data: {
    // -----------------------------  从上个页面带来的数据  -----------------------------

    /** 生活指数列表 */
    indices: [] as LivingIndex[],

    /** 首要展示的指数类型，即默认选中该项 */
    type: '',

    // ------------------------------  页面状态管理数据  ------------------------------

    /** 当前活跃的类型 */
    activeType: '',
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
  },
})
