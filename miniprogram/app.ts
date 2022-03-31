// app.ts

import { logger } from './app/core/logger'

App({
  onLaunch() {
    // logger.debug('项目启动 ...')
  },

  // 监听未处理的 Promise 拒绝事件
  onUnhandledRejection(res) {
    logger.debug(`[UnhandledRejection] ${res.reason}`)
  },
})
