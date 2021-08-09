import { DATA_QUERY, STO_TOKEN } from './contants'
import { logger } from './logger'
import { login } from './login'
import { EventName, execRequestedTasks, RequestedTasks } from './page-requested-task'
import { makeUrl } from './utils'
import { PageOptions } from './wx.interface'

export interface CustomPageOptions extends PageOptions {
  /** 页面数据 */
  data: Record<string, any>

  /** 注册的请求任务 */
  requested?: RequestedTasks

  /** 页面入参 */
  query?: (field?: string) => Record<string, string> | string

  /** 页面初始化 */
  init?: (eventName?: EventName) => void

  originalSetData?: (data: Record<string, any>) => void

  logger?: (...args: any[]) => void
}

export function CustomPage(options: CustomPageOptions): void {
  const optInit = options.init
  options.init = async function init(eventName?: EventName) {
    if (typeof optInit === 'function') {
      optInit.call(this)
    }

    if (!wx.getStorageSync(STO_TOKEN)) {
      await login()
    }

    execRequestedTasks(this, eventName)
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

    this.init('onLoad')
  }

  const optOnPullDownRefresh = options.onPullDownRefresh
  options.onPullDownRefresh = async function onPullDownRefresh(): Promise<void> {
    if (typeof optOnPullDownRefresh === 'function') {
      optOnPullDownRefresh.call(this)
    }

    this.init('onPullDownRefresh')
  }

  options.logger = logger
  options.query = function query(field?: string): Record<string, string> | string {
    const q = this.data[DATA_QUERY]
    if (field === undefined) {
      return q
    } else {
      return q[field]
    }
  }

  Page(options)
}
