'use strict'

/**
 * 将所有的公共文件挂载到当前文件下，便于引用
 */

const request = require('./core/request/request.js')
const login = require('./core/request/login.js')
const storage = require('./core/storage.js')
const logger = require('./core/logger.js')
const CustomApp = require('./core/CustomApp.js')
const CustomPage = require('./core/page/CustomPage.js')

module.exports = { request, login, storage, logger, CustomApp, CustomPage }
