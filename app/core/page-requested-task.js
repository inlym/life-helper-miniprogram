'use strict'

const request = require('./request')
const logger = require('./logger')

/** 在页面 `data` 存储的字段名：是否正在执行请求任务 */
const ON_REQUESTING = '__onRequesting__'

/** 在页面 `data` 存储的字段名：是否正在展示请求等待框 */
const ON_SHOWING_LOADING = '__onShowingLoading__'

/** 在 `Storage` 存储的字段名：对于 `requested` 任务，是否开启调试 */
const DEBUG_REQUESTED = '__debugRequested__'

/** 在该时间内未完成所有请求，则弹起等待框（单位：ms） */
const reservedNoLoadingTime = 2000

/** 在弹起等待框后，在该时间内仍未结束请求，则自动隐藏等待框 */
const keepLoadingTime = 2000

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
  if (requested === undefined) {
    return
  }

  // 格式错误情况
  if (typeof requested !== 'object') {
    throw new Error('配置项 `requested` 格式错误，应为一个对象！')
  }

  /** 是否打印调试信息 */
  const debug = wx.getStorageSync(DEBUG_REQUESTED)

  // 表示当前已开启请求任务
  this.setData({ [ON_REQUESTING]: true })

  // 在发起请求前做设定定时任务
  setTimeout(() => {
    if (this.data[ON_REQUESTING]) {
      if (debug) {
        logger.debug(`请求任务在 ${reservedNoLoadingTime}ms 内未结束，弹起 loading 提示框`)
      }

      // 表示当前已弹起等待框
      this.setData({ [ON_SHOWING_LOADING]: true })

      wx.showLoading({
        title: '正在获取数据',
        mask: true,
      })

      setTimeout(() => {
        if (this.data[ON_SHOWING_LOADING]) {
          if (debug) {
            logger.debug(`弹起 loading 提示框 ${keepLoadingTime}ms 后，请求仍未结束，自动隐藏 loading 提示框`)
          }
          this.setData({ [ON_SHOWING_LOADING]: false })
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

    validKeys.forEach((key) => {
      const { url, params, handler } = requested[key]

      let finalParams = {}

      // 根据 `params` 不同情况处理
      if (typeof params === 'object') {
        finalParams = params
      } else if (typeof params === 'function') {
        finalParams = params()
      }

      // 发起请求
      request({
        method: 'GET',
        url: url,
        params: finalParams,
      }).then((response) => {
        this.setData({
          [key]: response.data,
        })

        finished++
        if (finished >= taskNum) {
          this.setData({ [ON_REQUESTING]: false })
          if (this.data[ON_SHOWING_LOADING]) {
            this.setData({ [ON_SHOWING_LOADING]: false })
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

        // 处理 `handler`
        if (typeof handler === 'function') {
          handler(key, response.data)
        }
      })
    })
  }
}
