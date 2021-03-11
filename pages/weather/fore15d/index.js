'use strict'

const { CustomPage } = getApp()

CustomPage({
  data: {},

  computed: {},

  requested: {
    fore15d: {
      url: '/weather/15d',
      queries: 'qs',
    },
  },

  qs() {
    const { location } = this.getLoadOptions()
    return { location }
  },

  onLoad() {
    console.log(this.getLoadOptions())
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {},
})
