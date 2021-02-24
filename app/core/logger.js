'use strict'

const { env } = require('../config/config.js')
const { platform, enableDebug } = wx.getSystemInfoSync()
const { now, formatMs, nowMs } = require('./utils.js')
const keys = require('./keys.js')
const storage = require('./storage.js')

const realtimeLogger = wx.getRealtimeLogManager()
const localLogger = console

/** 当前日志距小程序启动时间的时间差 */
function diff() {
  const key = keys.KEY_APP_LAUNCH_TIME
  let time = storage.get(key)
  if (!time) {
    time = nowMs()
    storage.set(key, time)
  }
  return formatMs(nowMs() - time)
}

/** 是否使用本地的 console 打印日志 */
function useLocal() {
  if (platform === 'devtools' || enableDebug) {
    return true
  }
  return false
}

/** 是否使用实时日志功能打印日志 */
function useRealtime() {
  if (platform !== 'devtools') {
    return true
  }
  return false
}

/** 本地日志前缀 */
function prefixLocal() {
  return `[${now()}] [${diff()}] [${env.toUpperCase()}]`
}

/** 实时日志前缀 */
function prefixRealtime() {
  return `[${diff()}] [${env.toUpperCase()}]`
}

module.exports = {
  debug(...args) {
    localLogger.log(prefixLocal(), '[DEBUG]', ...args)
  },

  info(...args) {
    if (useLocal()) {
      localLogger.info(prefixLocal(), '[INFO]', ...args)
    }
    if (useRealtime()) {
      realtimeLogger.info(prefixRealtime(), ...args)
    }
  },

  warn(...args) {
    if (useLocal()) {
      localLogger.warn(prefixLocal(), '[WARN]', ...args)
    }
    if (useRealtime()) {
      realtimeLogger.warn(prefixRealtime(), ...args)
    }
  },

  error(...args) {
    if (useLocal()) {
      localLogger.error(prefixLocal(), '[ERROR]', ...args)
    }
    if (useRealtime()) {
      realtimeLogger.error(prefixRealtime(), ...args)
    }
  },

  tag(msg, ...args) {
    if (useRealtime()) {
      realtimeLogger.setFilterMsg(msg)

      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          realtimeLogger.addFilterMsg(args[i])
        }
      }
    }
  },
}
