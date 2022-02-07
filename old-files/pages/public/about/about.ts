import { ResourceUrl } from '../../../app/core/resources'

Page({
  data: {
    logoUrl: ResourceUrl.logo,
    count: 0,
  },

  /** 点击图片区域 */
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
            console.log('进入调试模式')
          }
        },
      })
    }
  },
})
