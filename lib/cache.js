'use strict'

/**
 * 对原生 Storage 相关操作的封装，模拟 Node.js Redis 的 API 进行操作
 * @since 2021-02-05
 */

/** 内设字段过期时间的前缀 */
const EXP_PREFIX = '__EXPIRATION_'

module.exports = class Cache {
  constructor() {
    this.launchTime = new Date()
  }

  /** 返回当前时间的毫秒数（ms） */
  now() {
    return new Date().getTime()
  }

  /** 将值转化为字符串存入 */
  set(key, value, ...args) {
    wx.setStorageSync(key, JSON.stringify(value))
    this.handle(key, ...args)
  }

  /** 不改变原值类型直接存入 */
  save(key, value, ...args) {
    wx.setStorageSync(key, value)
    this.handle(key, ...args)
  }

  /** 获取指定 key 的值（超过有效期后将返回为空） */
  get(key) {
    const data = wx.getStorageSync(key)
    const expireTime = wx.getStorageSync(`${EXP_PREFIX}${key}`)

    if (data && (!expireTime || (expireTime && expireTime > this.now()))) {
      return data
    }
  }

  /** 删除指定 key */
  del(key) {
    wx.removeStorageSync(key)
    wx.removeStorageSync(`${EXP_PREFIX}${key}`)
  }

  /** 指定 key 的过期时间，以秒计，即设置 n 秒后过期 */
  expire(key, seconds) {
    const expireTime = parseInt(seconds, 10) * 1000 + this.now()
    wx.setStorageSync(`${EXP_PREFIX}${key}`, expireTime)
  }

  /** 处理附加参数，目前仅过期时间 */
  handle(key, ...args) {
    if (args.length < 2) {
      return
    }

    /** 操作符 */
    const operator = args[0]

    /** 内容 */
    const content = args[1]

    /** 过期时间操作 */
    if (operator.toUpperCase() === 'EX') {
      this.expire(key, content)
    }
  }
}
