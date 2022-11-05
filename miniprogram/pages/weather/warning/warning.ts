import {themeBehavior} from '../../../behaviors/theme-behavior'
import {WarningNow} from '../../../app/services/weather-data'

// pages/weather/warning/warning.ts
Page({
  data: {
    warnings: [] as WarningNow[],
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('transferData', (data) => {
      this.setData({warnings: data})
    })
  },
})
