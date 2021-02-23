'use strict'

const login = require('./app/core/login.js')
const CustomApp = require('./app/core/CustomApp.js')

CustomApp({
  /** 生命周期回调 —— 监听小程序初始化 */
  onLaunch(options) {
    this.logger.info('小程序启动，启动参数为', options)

    // 小程序初始化时进行一次登录，从服务端获取 token，保存至缓存中
    login()
  },

  /** 小程序发生脚本错误或 API 调用报错时触发 */
  onError(error) {
    this.logger.error(error)
  },
})
