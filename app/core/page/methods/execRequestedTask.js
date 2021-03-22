'use strict'

const utils = require('../../utils.js')
const logger = require('../../logger.js')

/** 是否正在请求中，表示请求进行中，存在未响应的请求 */
const DATA_ON_REQUESTING = '__page_on_requesting__'

/** 是否正在弹 loading 的标志 */
const DATA_SHOWING_LOADING = '__page_showing_loading__'

/** 在指定时间内结束请求，则不弹 loading 框 */
const reservedNoLoadingTime = 2000

/** loading 框的维持时间，超出时间则隐藏 */
const keepLoadingTime = 3000

/**
 * 执行一次在 requested 中注册的请求任务
 * @this WechatMiniprogram.Page.Instance
 */
module.exports = function execRequestedTask(stage) {
  const requested = this.requested
  if (!requested) {
    return
  }

  if (typeof requested !== 'object') {
    throw new Error('requested 应该是一个对象！')
  }

  const tasks = []

  this._originalSetData({
    // 表示正在请求中，未结束
    [DATA_ON_REQUESTING]: true,
  })

  Object.keys(requested).forEach((key) => {
    const { url, queries, handler, ignore } = requested[key]
    if (!utils.matchStr(stage, ignore)) {
      const query = this.mergeQueries(queries)
      tasks.push(this.bindResponseData(key, url, query, handler))
    }
  })

  setTimeout(() => {
    if (this.data[DATA_ON_REQUESTING]) {
      logger.debug(`请求任务在 ${reservedNoLoadingTime}ms 内未结束，弹起 loading 提示框`)
      wx.showLoading({
        title: '数据更新中 ...',
        mask: true,
      })
      this._originalSetData({
        // 表示正在弹 loading 提示框未结束
        [DATA_SHOWING_LOADING]: true,
      })
      setTimeout(() => {
        if (this.data[DATA_SHOWING_LOADING]) {
          logger.debug(
            `弹起 loading 提示框 ${keepLoadingTime}ms 后，请求仍未结束，自动隐藏 loading 提示框`
          )
          wx.hideLoading()
          this._originalSetData({
            [DATA_SHOWING_LOADING]: false,
          })
        }
        if (this.data[DATA_ON_REQUESTING]) {
          wx.stopPullDownRefresh()
        }
      }, keepLoadingTime)
    }
  }, reservedNoLoadingTime)

  Promise.all(tasks).then((resList) => {
    if (this.data[DATA_ON_REQUESTING]) {
      wx.stopPullDownRefresh()
    }
    this._originalSetData({
      [DATA_ON_REQUESTING]: false,
    })

    if (this.data[DATA_SHOWING_LOADING]) {
      wx.hideLoading()
      this._originalSetData({
        [DATA_SHOWING_LOADING]: false,
      })
    }

    if (stage !== 'onLoad') {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000,
      })
    }
  })
}
