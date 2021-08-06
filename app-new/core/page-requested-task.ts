import { request } from './request'
import { login } from './login'
import { logger } from './logger'
import { CustomPageOptions } from './custom-page'
import { DATA_ON_REQUESTING, DATA_ON_SHOWING_LOADING, DATA_QUERY, DATA_TRANSFERRED_FIELDS } from './contants'

export type EventName = 'init' | 'onLoad' | 'onShow' | 'onPullDownRefresh'

/** 请求任务 */
export interface RequestedTask {
  /** 请求路径 */
  url: string

  /** 忽略事件，该事件不发送请求 */
  ignore?: EventName[]

  /** 请求参数 */
  params?: Record<string, string | number | boolean>

  /** 生成请求参数的函数 */
  paramsFn?: (query: Record<string, string>) => Record<string, string | number | boolean>

  handler?: (data: any, key?: string) => void
}

/** 请求任务集合 */
export interface RequestedTasks {
  /** `key` 对应储存的字段名 */
  [key: string]: RequestedTask
}

/**
 * 一次性执行所有的请求任务（只适用于单纯获取数据的 `GET` 请求）
 *
 * @this
 *
 * @param eventName 触发事件名称
 */
export function execRequestedTasks(this: CustomPageOptions, eventName: EventName) {
  const tasks = this.requested

  /** 是否开启调试模式 */
  const debug = true

  if (typeof tasks !== 'object' || Object.keys(tasks).length === 0) {
    return
  }

  // 表示当前已开启请求任务
  this.setData({ [DATA_ON_REQUESTING]: true })

  // 在发起请求前做设定定时任务
  setTimeout(() => {
    if (this.data[DATA_ON_REQUESTING]) {
      if (debug) {
        logger.debug(`请求任务在 2000ms 内未结束，弹起 loading 提示框`)
      }

      // 表示当前已弹起等待框
      this.setData({ [DATA_ON_SHOWING_LOADING]: true })

      wx.showLoading({
        title: '正在获取数据',
        mask: true,
      })

      setTimeout(() => {
        if (this.data[DATA_ON_SHOWING_LOADING]) {
          if (debug) {
            logger.debug(`弹起 loading 提示框 2000ms 后，请求仍未结束，自动隐藏 loading 提示框`)
          }
          this.setData({ [DATA_ON_SHOWING_LOADING]: false })
          wx.hideLoading()

          if (eventName === 'onPullDownRefresh') {
            wx.stopPullDownRefresh()
          }
        }
      }, 2000)
    }
  }, 2000)

  // 处理 `ignore` 参数，获取要执行的任务列表
  const validTaskKeys = Object.keys(tasks!).filter((key: string) => !tasks[key].ignore || !tasks[key].ignore!.includes(eventName))

  const taskTotal = validTaskKeys.length

  if (taskTotal === 0) {
    return
  }

  /** 已完成的任务数 */
  let finished = 0

  /**
   * 逐个发送请求时，要各管各处理请求，不能使用以下方法，会导致所有请求都返回结果了才处理。
   * ```js
   * const promises = validKeys.map((key)=>{...})
   * const result = await Promise.all(promises)
   * ...
   * ```
   */
  validTaskKeys.forEach((key: string) => {
    const { url, params, paramsFn, handler } = tasks[key]

    let finalParams: Record<string, string | number | boolean> = {}
    if (paramsFn) {
      finalParams = paramsFn.call(this, this.query())
    } else if (params) {
      finalParams = params
    }

    request({
      method: 'GET',
      url: url,
      params: finalParams,
    }).then((response) => {
      // 仅请求成功才处理赋值逻辑
      if (response.status >= 200 && response.status < 300) {
        /**
         * `key` 名为 `page` 则直接将整个响应数据赋值，其他则对 `key` 赋值
         */
        if (key === 'page') {
          this.setData(response.data)
        } else {
          this.setData({
            [key]: response.data,
          })
        }

        // 处理 `handler`
        if (typeof handler === 'function') {
          handler.call(this, response.data, key)
        }
      }

      finished++
      if (finished >= taskTotal) {
        this.setData({ [DATA_ON_REQUESTING]: false })
        if (this.data[DATA_ON_SHOWING_LOADING]) {
          this.setData({ [DATA_ON_SHOWING_LOADING]: false })
          wx.hideLoading()
        }
        if (eventName === 'onPullDownRefresh') {
          wx.stopPullDownRefresh()
        }

        if (eventName !== 'onLoad') {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 1500,
          })
        }
      }
    })
  })
}
