import { logger } from './app/core/logger'
import { ResourceUrl } from './app/core/resources'

App({
  onLaunch() {
    logger.debug('[onLaunch]')
  },

  // 监听小程序错误事件
  onError(error) {
    logger.error(`[onError] ${error}`)
  },

  // 下述是附加到 `app` 上的方法
  ResourceUrl,
})
