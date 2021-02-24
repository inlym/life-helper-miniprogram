'use strict'

const { env } = require('../config/config.js')
const { platform, enableDebug } = wx.getSystemInfoSync()
const { now, formatMs, nowMs } = require('./utils.js')
const keys = require('./keys.js')
const storage = require('./storage.js')

const realtimeLogger = wx.getRealtimeLogManager()
const localLogger = console

function diff() {
  let appShowTime = storage.get(keys.KEY_APP_SHOW_TIME)
  if (!appShowTime) {
    appShowTime = nowMs()
    storage.set(keys.KEY_APP_SHOW_TIME, appShowTime)
  }

  return formatMs(nowMs() - appShowTime)
}

module.exports = {
  debug(...args) {
    localLogger.log(`[${now()}] [${diff()}]`, '[DEBUG]', ...args)
  },

  info(...args) {
    if (platform === 'devtools' || enableDebug) {
      localLogger.info(`[${now()}]`, `[${diff()}]`, '[INFO]', ...args)
    }
    if (platform !== 'devtools' && env === 'prod') {
      realtimeLogger.info(`[${diff()}]`, ...args)
    }
  },

  warn(...args) {
    if (platform === 'devtools' || enableDebug) {
      localLogger.warn(`[${now()}]`, `[${diff()}]`, '[WARN]', ...args)
    }
    if (platform !== 'devtools' && env === 'prod') {
      realtimeLogger.warn(`[${diff()}]`, ...args)
    }
  },

  error(...args) {
    if (platform === 'devtools' || enableDebug) {
      localLogger.error(`[${now()}]`, `[${diff()}]`, '[ERROR]', ...args)
    }
    if (platform !== 'devtools' && env === 'prod') {
      realtimeLogger.error(`[${diff()}]`, ...args)
    }
  },

  tag(msg, ...args) {
    if (platform !== 'devtools' && env === 'prod') {
      realtimeLogger.setFilterMsg(msg)

      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          realtimeLogger.addFilterMsg(args[i])
        }
      }
    }
  },
}
