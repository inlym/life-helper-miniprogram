'use strict'

const { env } = require('../config/config.js')

const loggers = {
  test: console,
  prod: wx.getRealtimeLogManager(),
}

const logger = loggers[env]

module.exports = logger
