import {logger} from '../app/core/logger'

export const themeBehavior = Behavior({
  data: {
    /** 主题：'light' | 'dark' */
    theme: wx.getSystemInfoSync().theme,
  },

  lifetimes: {
    attached() {
      wx.onThemeChange((res) => {
        this.setData({theme: res.theme})
        logger.debug('系统主题切换为：', res.theme)
      })
    },
  },
})
