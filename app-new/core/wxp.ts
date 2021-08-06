import { STO_CODE } from './contants'

/** 存入 Storage 的 code 信息 */
export interface CodeInfo {
  code: string
  timestamp: number
}

/**
 * 获取微信 code
 *
 * 说明：
 * 1. 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * 2. [接口调用频率规范](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html)
 */
export function getCode() {
  /** `code` 缓存时长：30分钟 */
  const timeout = 1000 * 60 * 30

  return new Promise((resolve, reject) => {
    const lastCode: CodeInfo = wx.getStorageSync(STO_CODE)
    if (lastCode && typeof lastCode === 'object') {
      const diff = Date.now() - lastCode.timestamp
      if (diff < timeout) {
        resolve(lastCode.code)
        return
      }
    }

    wx.login({
      success(res) {
        const code: string = res.code
        wx.setStorageSync(STO_CODE, { code, timestamp: Date.now() })
        resolve(code)
      },
      fail() {
        reject(new Error('调用 wx.login 失败!'))
      },
    })
  })
}
