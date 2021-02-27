'use strict'

const defaults = require('../defaults.js')
const logger = require('../../logger.js')

module.exports = function showLoading(content) {
  const time = this._configOptions.ReservedNoLoadingTime || defaults.config.ReservedNoLoadingTime
  const title = content || '数据更新中 ...'

  setTimeout(() => {
    if (this.data._onRequesting) {
      logger.debug(`请求任务在 ${time}ms 内未结束，弹起 loading 提示框，提示文案：${title}`)
      wx.showLoading({
        title,
        mask: true,
      })
    }
  }, time)
}
