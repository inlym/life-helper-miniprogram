'use strict'

const CustomPage = require('./app/core/custom-page')
const getResUrl = require('./app/core/resource-path')
const logger = require('./app/core/logger')

App({
  onLaunch() {},

  // 监听小程序错误事件
  onError(error) {
    logger.error(`[onError] ${error}`)
  },

  // 下述是附加到 `app` 上的方法
  CustomPage,
  getResUrl,
})
