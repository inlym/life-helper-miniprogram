'use strict'

const { STO_CODE } = require('./constants')

/**
 * 对微信原生函数仅做一层简单封装的函数放在这里
 */

/**
 * 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
 *
 * 说明：
 * 1. 小程序内所有需要获取 `code` 的场景，均需此函数获取，不允许在另外的地方调用 `wx.login` 方法
 */
exports.getCode = function getCode() {
  /** `code` 缓存时长：30分钟 */
  const timeout = 1000 * 60 * 30

  return new Promise((resolve, reject) => {
    const lastCode = wx.getStorageSync(STO_CODE)
    if (lastCode && typeof lastCode === 'object') {
      const diff = Date.now() - lastCode.timestamp
      if (diff < timeout) {
        resolve(lastCode.code)
        return
      }
    }

    wx.login({
      success(res) {
        const code = res.code
        wx.setStorageSync(STO_CODE, { code, timestamp: Date.now() })
        resolve(code)
      },
      fail() {
        reject(new Error('调用 wx.login 失败!'))
      },
    })
  })
}
