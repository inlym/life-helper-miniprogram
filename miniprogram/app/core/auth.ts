/**
 * 权限相关方法
 * @date 2022-02-09
 */

import {StorageField} from './constant'
import {requestForData} from './http'
import {enhancedStorage, EnhancedStorage} from './storage'

/**
 * 获取微信 code
 *
 * ## 说明
 * 1. 由于微信新增的特色机制，无法按需获取 `code`，因此对获取的 `code` 增加了一层缓存机制（服务端也配套做了缓存）
 * 2. [接口调用频率规范](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html)
 */
export function getCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const code = enhancedStorage.get<string>(StorageField.CODE)
    if (code) {
      resolve(code)
      return
    }

    wx.login({
      success(res) {
        resolve(res.code)
        enhancedStorage.set(StorageField.CODE, res.code, EnhancedStorage.ofMinutes(5))
      },
      fail(res) {
        reject(new Error(res.errMsg))
      },
    })
  })
}

/** 登录接口响应数据 */
export interface TokenInfo {
  /** 登录凭证创建时间 */
  createTime: number

  /** 登录凭证过期时间 */
  expireTime: number

  /** 登录凭证 */
  token: string

  /** 登录凭证类型 */
  type: string
}

/**
 * 登录
 */
export async function login(): Promise<string> {
  const code = await getCode()
  const data = await requestForData<TokenInfo>({
    method: 'POST',
    url: '/login/wechat',
    data: {code},
    auth: false,
  })

  console.log(data)

  enhancedStorage.set(StorageField.TOKEN, data.token, data.expireTime)

  return data.token
}

/**
 * 获取本地存储的登录凭证，若为空，则返回空字符串
 */
export function getLocalToken(): string {
  const token = enhancedStorage.get<string>(StorageField.TOKEN)
  if (token) {
    return token
  }

  return ''
}

/** 确保已登录 */
export async function ensureLogined(): Promise<void> {
  if (!getLocalToken()) {
    await login()
  }
}
