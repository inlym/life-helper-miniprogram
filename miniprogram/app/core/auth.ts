/**
 * 权限相关方法
 * @date 2022-02-09
 */

import {StorageField} from './constant'
import {requestForData} from './http'
import {storage, Storage} from './storage'

/**
 * 获取微信 code
 *
 * ## 说明
 * 1. 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * 2. [接口调用频率规范](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html)
 */
export function getCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const code = storage.get<string>(StorageField.CODE)
    if (code) {
      resolve(code)
      return
    }

    wx.login({
      success(res) {
        resolve(res.code)
        storage.set(StorageField.CODE, res.code, Storage.ofMinutes(5))
      },
      fail(res) {
        reject(new Error(res.errMsg))
      },
    })
  })
}

/** 登录接口响应数据 */
export interface SecurityToken {
  /** 鉴权令牌 */
  token: string

  /** 权令牌类型 */
  type: string

  /** 发起请求时，携带令牌的请求头名称 */
  headerName: string

  /** 创建时间 */
  createTime: string

  /** 过期时间 */
  expireTime: string
}

/**
 * 登录
 */
export async function login(): Promise<SecurityToken> {
  const code = await getCode()
  const data = await requestForData<SecurityToken>({
    method: 'POST',
    url: '/login/wechat',
    data: {code, appId: 'wx09c0a1ea5251c75a'},
    auth: false,
  })

  storage.set(StorageField.TOKEN, data, data.expireTime)

  return data
}
