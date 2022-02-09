/**
 * 对微信原生方法做的二次封装
 */

import { StorageField } from './constant'

/** 存入 Storage 的 code 信息 */
export interface CodeInfo {
  /** code 内容 */
  code: string

  /** 保存时刻的时间戳 */
  timestamp: number
}

/**
 * 获取微信 code
 *
 * 说明：
 * 1. 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * 2. [接口调用频率规范](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html)
 */
export function getCode(): Promise<string> {
  /** `code` 缓存时长：5分钟 */
  const timeout = 1000 * 60 * 5

  return new Promise((resolve, reject) => {
    const lastCodeInfo: CodeInfo = wx.getStorageSync<CodeInfo>(StorageField.CODE)
    if (lastCodeInfo && typeof lastCodeInfo === 'object') {
      const diff = Date.now() - lastCodeInfo.timestamp
      if (diff < timeout) {
        resolve(lastCodeInfo.code)
        return
      }
    }

    wx.login({
      success(res) {
        const code = res.code
        wx.setStorageSync<CodeInfo>(StorageField.CODE, {code, timestamp: Date.now()})
        resolve(code)
      },
      fail(res) {
        reject(new Error(res.errMsg))
      },
    })
  })

}
