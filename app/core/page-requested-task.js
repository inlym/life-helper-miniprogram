'use strict'

const request = require('./request')
const logger = require('./logger')
const constants = require('./constants')

const { DATA_ON_REQUESTING, DATA_ON_SHOWING_LOADING, STO_DEBUG_REQUESTED, reservedNoLoadingTime, keepLoadingTime } = constants

/**
 * 一次性执行所有的请求任务（只适用于单纯获取数据的 `GET` 请求）
 *
 * 处理事项：
 * 1. 发送请求
 * 2. 在 `data` 赋值
 *
 * @this WechatMiniprogram.Page.Instance
 *
 * @param {string} eventName 触发事件名称
 *
 * @param {Object} requested 注册的请求任务
 * @param {string} requested[key] 响应数据存储的变量名
 * @param {string} requested[key].url 请求路径
 * @param {Object|Function} requested[key].params 请求参数
 * @param {Array} requested[key].ignore 忽略事件，特定事件绕过当前任务
 * @param {Function} requested[key].handler 对响应数据做处理
 */
module.exports = function execRequestedTasks(eventName) {
  const requested = this.requested

  // 未定义则直接跳过
  if (requested === undefined || (typeof requested === 'object' && Object.keys(requested).length === 0)) {
    return
  }

  // 格式错误情况
  if (typeof requested !== 'object') {
    throw new Error('配置项 `requested` 格式错误，应为一个对象！')
  }

  /** 是否打印调试信息 */
  const debug = wx.getStorageSync(STO_DEBUG_REQUESTED)

  // 表示当前已开启请求任务
  this.setData({ [DATA_ON_REQUESTING]: true })

  // 在发起请求前做设定定时任务
  setTimeout(() => {
    if (this.data[DATA_ON_REQUESTING]) {
      if (debug) {
        logger.debug(`请求任务在 ${reservedNoLoadingTime}ms 内未结束，弹起 loading 提示框`)
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
            logger.debug(`弹起 loading 提示框 ${keepLoadingTime}ms 后，请求仍未结束，自动隐藏 loading 提示框`)
          }
          this.setData({ [DATA_ON_SHOWING_LOADING]: false })
          wx.hideLoading()

          if (eventName === 'onPullDownRefresh') {
            wx.stopPullDownRefresh()
          }
        }
      }, keepLoadingTime)
    }
  }, reservedNoLoadingTime)

  // 处理 `ignore` 参数，获取要执行的任务列表
  const validKeys = Object.keys(requested).filter(
    (key) => !requested[key]['ignore'] || !eventName || !requested[key].ignore.includes(eventName)
  )

  /** 任务数 */
  const taskNum = validKeys.length

  if (taskNum > 0) {
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
    validKeys.forEach((key) => {
      const { url, params, handler } = requested[key]

      let finalParams = {}

      // 根据 `params` 不同情况处理
      if (typeof params === 'object') {
        finalParams = params
      } else if (typeof params === 'function') {
        finalParams = params.call(this, this.query())
      }

      /**
       * `finalParams` 的结果为 `false` 时，则不发送请求，即到此为止，不继续了
       * (常用于编辑页，进入页面带 `id` 则发送请求获取该数据，不带 `id` 则无需发送请求获取数据)
       */
      if (finalParams === false) {
        return
      }

      // 对 `finalParams` 再次做个检验
      if (typeof finalParams !== 'object') {
        throw new Error('在 `requested` 中配置对象的 `params` 应返回一个对象！')
      }

      // 发起请求
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
        if (finished >= taskNum) {
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
}
