'use strict'

const { CustomApp } = require('./app/apps.js')

CustomApp({
  /** 生命周期回调 —— 监听小程序初始化 */
  onLaunch() {},

  /** 小程序发生脚本错误或 API 调用报错时触发 */
  onError(error) {
    this.logger.error(error)
  },
})
