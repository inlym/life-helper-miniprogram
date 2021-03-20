'use strict'

/**
 * 将 core 文件夹下相关文件挂载到这里，供其他文件引用
 *
 * 注意：
 * 1. [core] 文件夹内的文件不可引用此文件，否则会形成循环引用
 */

const storage = require('./core/storage.js')
const logger = require('./core/logger.js')
const CustomApp = require('./core/CustomApp.js')
const CustomPage = require('./core/CustomPage.js')
const utils = require('./core/utils.js')
const HttpRequest = require('./core/HttpRequest.js')
const config = require('./config/config.js')

const httpClient = HttpRequest.create(config)

function request(opt) {
  return httpClient.request(opt)
}

module.exports = { storage, logger, CustomApp, CustomPage, utils, request }
