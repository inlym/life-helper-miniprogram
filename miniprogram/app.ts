// app.ts

import {logger} from './app/core/logger'

App({
  /** 小程序全局数据 */
  globalData: {
    /** 主题，值为 light 或 dark */
    theme: 'light',
  },

  onLaunch() {
    // logger.debug('项目启动 ...')
  },

  // 监听未处理的 Promise 拒绝事件
  onUnhandledRejection(res) {
    logger.debug(`[UnhandledRejection] ${res.reason}`)
  },

  /** 监听系统切换主题 */
  onThemeChange(res) {
    this.globalData.theme = res.theme
  },
})
