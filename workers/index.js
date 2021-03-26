'use strict'

/**
 * 当前文件为 worker 的入口文件，负责文件的引入和汇总
 */

worker.onMessage((res) => {
  console.log('在 Worker 接收到来自 App 的消息，内容为：', res)
})
