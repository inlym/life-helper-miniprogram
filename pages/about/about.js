'use strict'

const { CustomPage, getResUrl } = getApp()

CustomPage({
  data: {
    logoUrl: getResUrl('logo'),

    count: 0,
  },

  handleTap() {
    const count = this.data.count
    this.setData({
      count: count + 1,
    })

    if (this.data.count >= 10) {
      wx.showModal({
        content: '是否进入调试模式？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/debug/debug' })
          }
        },
      })
    }
  },
})
