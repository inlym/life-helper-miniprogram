/**
 * 权限相关方法
 * @date 2022-02-09 23:33
 */

import { getCode } from './wxp'
import { http } from './http'
import { StorageField } from './constant'

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
  const data = await http.post<TokenInfo>('/login/weixin', { code })
  wx.setStorageSync(StorageField.TOKEN, data)

  return data.token
}

/**
 * 获取登录凭证
 */
export async function getToken(): Promise<string> {
  const tokenInfo = wx.getStorageSync<TokenInfo>(StorageField.TOKEN)
  if (tokenInfo && tokenInfo.token) {
    return tokenInfo.token
  }

  return ''
}
