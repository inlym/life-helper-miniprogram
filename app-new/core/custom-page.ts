import { PageOptions } from './wx.interface'
import { RequestedTasks } from './page-requested-task'

export interface CustomPageOptions extends PageOptions {
  /** 页面数据 */
  data: Record<string, any>

  /** 注册的请求任务 */
  requested?: RequestedTasks

  /** 页面入参 */
  query: () => Record<string, string>
}
