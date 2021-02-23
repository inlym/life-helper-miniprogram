'use strict'

const { env } = require('../config/config.js')

const loggers = {
  test: console,
  prod: wx.getRealtimeLogManager(),
}

module.exports = loggers[env]
