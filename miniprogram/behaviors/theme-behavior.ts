import {logger} from '../app/core/logger'

export const themeBehavior = Behavior({
  data: {
    theme: wx.getSystemInfoSync().theme,
  },

  lifetimes: {
    attached() {
      wx.onThemeChange((res) => {
        this.setData({theme: res.theme})
        logger.debug('系统主题切换为：', res.theme)
      })
    },

    detached() {
      wx.offThemeChange()
    },
  },
})
