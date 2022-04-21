/**
 * 对微信小程序原生的数据缓存做二次封装
 */

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
export class StoragePlus {
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
   * @param expiration 有效期，单位：毫秒
   */
  set<T = any>(key: string, data: T, expiration: number): void

  set<T = any>(first: string, second: T, third: number): void {
    const key = first
    const data = second

    const longEnoughMs = 2 * 365 * 24 * 3600 * 1000
    const expiration = third ? third : longEnoughMs

    const createTime = Date.now()
    const expireTime = createTime + expiration

    const wrapper: StorageWrapper<T> = {createTime, expireTime, data}

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

export const storage = new StoragePlus()
