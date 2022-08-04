// app.ts

import {logger} from './app/core/logger'

App({
  // 监听未处理的 Promise 拒绝事件
  onUnhandledRejection(res) {
    logger.debug(`[UnhandledRejection] ${res.reason}`)
  },
})
