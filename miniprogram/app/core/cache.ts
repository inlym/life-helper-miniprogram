/**
 * 对小程序数据缓存的进一步封装
 *
 * ## 说明
 * 1. 增加了到期时间处理。
 */
import { Duration } from '../utils/duration'

/**
 * 获取指定键名的缓存值
 * @param {string} key 键名
 */
function get<T = any>(key: string): T | null {
  const result = wx.getStorageSync<CacheData<T>>(key)

  // 经过封装后，所有的数据都是被封装为一个对象
  if (typeof result !== 'object') {
    return null
  }

  // 如果数据已过期
  if (Date.now() > result.expireTime) {
    wx.removeStorageSync(key)
    return null
  }

  return result.data
}

function set<T = any>(key: string, data: T): void
function set<T = any>(key: string, data: T, expireMillis: number): void
function set<T = any>(key: string, data: T, expireIn: Duration): void
function set<T = any>(key: string, data: T, expireParam?: unknown): void {
  // 创建时间
  const createTime = Date.now()

  // 默认有效期10天
  let expireTime = createTime + 10 * Duration.HOURS_PER_DAY * Duration.MINUTES_PER_HOUR * Duration.SECONDS_PER_MINUTE * 1000

  if (typeof expireParam === 'number') {
    expireTime = expireParam
  } else if (expireParam instanceof Duration) {
    expireTime = createTime + expireParam.toMillis()
  }

  const result: CacheData = { createTime, expireTime, data }

  wx.setStorageSync(key, result)
}

/**
 * 自定义缓存数据存储格式
 */
export interface CacheData<T = any> {
  /** 创建时间（时间戳，毫秒） */
  createTime: number

  /** 过期时间（时间戳，毫秒） */
  expireTime: number

  /** 存储数据 */
  data: T
}

export const cache = { get, set }
