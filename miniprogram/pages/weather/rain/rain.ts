import {themeBehavior} from '../../../behaviors/theme-behavior'
import {MinutelyRain} from '../../../app/services/weather-data'

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
    eventChannel.on('transferData', (data) => {
      this.setData(data)
    })

    const title = this.data.locationName
    wx.setNavigationBarTitle({title})
  },
})
