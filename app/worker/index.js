'use strict'

/**
 * 启动 Worker，其他文件可以通过 app.worker 获取
 */

module.exports = function createWorker() {
  // 启动 worker
  const worker = wx.createWorker('workers/index.js')

  return worker
}
