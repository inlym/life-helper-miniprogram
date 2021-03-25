'use strict'

/**
 * 将以下文件夹下相关文件挂载到这里，供其他文件引用
 * 1. [core]
 * 2. [ext]
 */

const storage = require('./core/storage.js')
const logger = require('./core/logger.js')
const CustomApp = require('./core/CustomApp.js')
const CustomPage = require('./core/CustomPage.js')
const utils = require('./core/utils.js')
const HttpRequest = require('./core/HttpRequest.js')
const config = require('./config/config.js')
const base64 = require('./ext/base64.js')

const httpClient = HttpRequest.create(config)

function request(opt) {
  return httpClient.request(opt)
}

module.exports = { storage, logger, CustomApp, CustomPage, base64, utils, request }
