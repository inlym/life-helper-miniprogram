/**
 * 主题切换跟踪器
 *
 * ## 备注
 * 1. 按照正常流程，应该在 `detached` 生命周期时进行取消主题切换监听（`wx.offThemeChange`），如果不取消监听会导致监听器不断增多。
 * 2. 加上取消监听代码后，会导致主题切换监听异常，暂无解决办法。
 * 3. 综上考虑，不取消监听。
 */
export const themeBehavior = Behavior({
  data: {
    /** 主题：'light' | 'dark' */
    theme: wx.getSystemInfoSync().theme,
  },

  lifetimes: {
    attached() {
      wx.onThemeChange((res) => {
        this.setData({theme: res.theme})
      })
    },

    ready() {
      this.setData({theme: wx.getSystemInfoSync().theme})
    },
  },
})
