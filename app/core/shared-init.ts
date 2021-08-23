import { ensureLogined } from './auth'
import { logger } from './logger'
import { makeUrl } from './utils'

export type EventName = 'onLoad' | 'onPullDownRefresh' | string

/**
 * 公共页面初始化
 *
 * @param eventName 触发事件
 */
export async function sharedInit(eventName?: EventName): Promise<void> {
  await ensureLogined()

  // 打印页面路由
  if (eventName === 'onLoad') {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const url = makeUrl(current.route, current.options)
    logger.debug(`[Route] ${url}`)
  }

  if (eventName === 'onPullDownRefresh') {
    setTimeout(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '更新成功！',
        icon: 'none',
      })
    }, 1000)
  }
}