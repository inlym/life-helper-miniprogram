/**
 * 权限相关方法
 * @date 2022-02-09
 */

import { Duration } from '../utils/duration'
import { cache } from './cache'
import { StorageField } from './constant'
import { requestForData } from './http'

/**
 * 获取微信 code
 *
 * 说明：
 * 1. 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * 2. [接口调用频率规范](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html)
 */
export function getCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const code = cache.get<string>(StorageField.CODE)
    if (code) {
      resolve(code)
      return
    }

    wx.login({
      success(res) {
        resolve(res.code)
        cache.set(StorageField.CODE, res.code, Duration.ofMinutes(5))
      },
      fail(res) {
        reject(new Error(res.errMsg))
      },
    })
  })
}

/** 登录接口响应数据 */
export interface TokenInfo {
  /** 到期时间的时间戳 */
  expiration: number

  /** 登录凭证 */
  token: string
}

/**
 * 登录
 */
export async function login(): Promise<string> {
  const code = await getCode()
  const data = await requestForData<TokenInfo>({
    method: 'POST',
    url: '/login/weixin',
    data: { code },
    auth: false,
  })

  cache.set(StorageField.TOKEN, data.token, data.expiration)

  return data.token
}

/**
 * 获取登录凭证
 */
export function getToken(): string {
  const token = cache.get<string>(StorageField.TOKEN)
  if (token) {
    return token
  }

  return ''
}
