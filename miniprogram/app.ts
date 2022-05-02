// app.ts

import {ensureLogined} from './app/core/auth'
import {logger} from './app/core/logger'

App({
  onLaunch() {
    wx.nextTick(ensureLogined)
  },

  // 监听未处理的 Promise 拒绝事件
  onUnhandledRejection(res) {
    logger.debug(`[UnhandledRejection] ${res.reason}`)
  },
})
