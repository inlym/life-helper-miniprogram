// app.ts

import {logger} from './app/core/logger'
import {checkUpdate} from './app/core/system'

App({
  // 监听未处理的 Promise 拒绝事件
  onUnhandledRejection(res) {
    logger.debug(`[UnhandledRejection] ${res.reason}`)
  },

  onShow() {
    // 检查版本更新
    checkUpdate()
  },
})
