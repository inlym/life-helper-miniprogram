import {themeBehavior} from '../../../behaviors/theme-behavior'
import {WarningNow} from '../../../app/services/weather-data'
import {PageChannelEvent} from '../../../app/core/constant'

// pages/weather/warning/warning.ts
Page({
  data: {
    warnings: [] as WarningNow[],
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)
      })
    }
  },
})
