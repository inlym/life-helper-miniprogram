/**
 * 对微信小程序原生的数据缓存做二次封装
 */

import dayjs from 'dayjs'
import {logger} from './logger'

/**
 * 计算到期时间的时间戳
 *
 * @param time 到期时间或有效时长（毫秒）
 */
function calcExpireTime(time?: string | number): number {
  // 使用 2 年的毫秒数表示一个足够长的时间区间
  const LONG_ENOUGH_MS = 2 * 365 * 24 * 3600 * 1000

  // 情况（1）：形如 `2022-12-01 19:44:13` 格式的字符串
  if (typeof time === 'string') {
    return dayjs(time).valueOf()
  }

  if (typeof time === 'number') {
    // 情况（2）：是一个时间戳
    if (time > LONG_ENOUGH_MS) {
      return time
    } else {
      // 情况（3）：表示有效时长（毫秒）
      return Date.now() + time
    }
  }

  return Date.now() + LONG_ENOUGH_MS
}

/** 最终存入数据缓存的数据格式 */
export interface StorageWrapper<T = any> {
  /** 创建时间（时间戳，毫秒） */
  createTime: number

  /** 过期时间（时间戳，毫秒） */
  expireTime: number

  /** 存储数据 */
  data: T
}

/**
 * 二次封装的数据缓存方法
 */
export class Storage {
  constructor() {
    // 空
  }

  /**
   * 将分钟数转换为毫秒值
   *
   * @param minutes 分钟数
   */
  static ofMinutes(minutes: number): number {
    return minutes * 60 * 1000
  }

  /**
   * 保存数据
   *
   * @param key 键名
   * @param data 要存入的数据
   */
  set<T = any>(key: string, data: T): void

  /**
   * 保存数据
   *
   * @param key 键名
   * @param data 要存入的数据
   * @param expiration 有效期或到期时间，单位：毫秒
   */
  set<T = any>(key: string, data: T, expiration: number): void

  /**
   * 保存数据
   *
   * @param key 键名
   * @param data 要存入的数据
   * @param expiration 到期时间字符串
   */
  set<T = any>(key: string, data: T, expiration: string): void

  set<T = any>(first: string, second: T, third?: number | string): void {
    const key = first
    const data = second
    const createTime = Date.now()
    const expireTime = calcExpireTime(third)

    const wrapper: StorageWrapper<T> = {createTime, expireTime, data}
    logger.debug(`[STORAGE][SET] key=${key}, data=${JSON.stringify(data)}`)

    wx.setStorageSync(key, wrapper)
  }

  /**
   * 获取数据
   *
   * @param key 键名
   */
  get<T = any>(key: string): T | null {
    const wrapper: StorageWrapper = wx.getStorageSync(key)

    // 经过封装后，必定是一个对象，该情况说明该键值不存在
    if (typeof wrapper !== 'object') {
      return null
    }

    // 过期情况
    if (Date.now() > wrapper.expireTime) {
      wx.removeStorageSync(key)
      return null
    }

    logger.debug(`[STORAGE][GET] key=${key}, data=${JSON.stringify(wrapper.data)}`)

    return wrapper.data
  }

  /**
   * 删除数据缓存
   *
   * @param key 键名
   */
  remove(key: string): void {
    wx.removeStorageSync(key)
  }
}

export const storage = new Storage()
