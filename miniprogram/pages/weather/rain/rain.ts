import {themeBehavior} from '../../../behaviors/theme-behavior'
import {MinutelyRain} from '../../../app/services/weather-data'
import {PageChannelEvent} from '../../../app/core/constant'

Page({
  data: {
    // -----------------------------  从上个页面带来的数据  -----------------------------

    /** 分钟级降水数据 */
    rain: {} as MinutelyRain,

    /** 地点名称 */
    locationName: '',
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)
      })
    }

    // 将页面标题设为地点名称
    const title = this.data.locationName
    wx.setNavigationBarTitle({title})
  },
})
