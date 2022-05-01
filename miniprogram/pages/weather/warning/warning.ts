import {WarningItem} from '../../../app/services/weather-data.interface'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/weather/warning/warning.ts
Page({
  data: {
    warnings: [] as WarningItem[],
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('transferData', (data) => {
      this.setData({warnings: data})
    })
  },
})
