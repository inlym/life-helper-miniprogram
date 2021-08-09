import { DATA_QUERY, STO_TOKEN } from './contants'
import { logger } from './logger'
import { login } from './login'
import { EventName, execRequestedTasks, RequestedTasks } from './page-requested-task'
import { makeUrl } from './utils'
import { PageOptions } from './wx.interface'
import { getResUrl } from './resources'

export interface CustomPageOptions extends PageOptions {
  /** 页面数据 */
  data: Record<string, any>

  /** 注册的请求任务 */
  requested?: RequestedTasks

  /** 页面入参 */
  query?: () => Record<string, string>

  /** 页面初始化 */
  init?: (eventName: EventName) => void

  originalSetData?: (data: Record<string, any>) => void

  getResUrl?: (name: string) => string

  logger?: any
}

export function CustomPage(options: CustomPageOptions): void {
  const optInit = options.init
  options.init = async function init(eventName: EventName) {
    if (typeof optInit === 'function') {
      optInit.call(this, 'init')
    }

    if (!wx.getStorageSync(STO_TOKEN)) {
      await login()
    }

    execRequestedTasks.call(this, eventName)
  }

  const optOnLoad = options.onLoad
  options.onLoad = async function onLoad(query: Record<string, string>): Promise<void> {
    this.setData({ [DATA_QUERY]: query })
    logger.debug(`[Route] ${makeUrl(this.route, query)}`)

    this.originalSetData = this.setData

    /**
     * todo
     */

    // this.setData = newSetData

    if (typeof optOnLoad === 'function') {
      optOnLoad.call(this, query)
    }

    this.init!('onLoad')
  }

  const optOnPullDownRefresh = options.onPullDownRefresh
  options.onPullDownRefresh = async function onPullDownRefresh(): Promise<void> {
    if (typeof optOnPullDownRefresh === 'function') {
      optOnPullDownRefresh.call(this)
    }

    this.init!('onPullDownRefresh')
  }

  options.logger = logger
  options.getResUrl = getResUrl
  options.query = function query(): Record<string, string> {
    return this.data[DATA_QUERY] || {}
  }

  Page(options)
}
