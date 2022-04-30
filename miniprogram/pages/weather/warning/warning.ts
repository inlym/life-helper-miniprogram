import {WarningItem} from '../../../app/services/weather-data.interface'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/weather/warning/warning.ts
Page({
  data: {
    warnings: [] as WarningItem[],
  },

  behaviors: [themeBehavior],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('transferData', (data) => {
      console.log(data)

      this.setData({warnings: data})
    })
  },
})
