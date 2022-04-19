import {logger} from './logger'

/** 主题类型 */
export type ThemeType = 'light' | 'dark'

/**
 * 获取主题类型
 */
export function getTheme(): ThemeType {
  const {theme} = wx.getSystemInfoSync()
  return theme
}

export const themeBehavior = Behavior({
  data: {
    theme: getTheme(),
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
