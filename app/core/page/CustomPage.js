'use strict'

const logger = require('../logger.js')

module.exports = function CustomPage(configuration) {
  const _originalConfiguration = configuration
  const _originalData = configuration.data
  const _originalRequested = configuration.requested
  const _originalComputed = configuration.computed

  /** 自定义方法 */
  const customPageMethods = {}
}
