import { AxiosRequestConfig } from 'axios'
import { TokenInfo } from '../core/auth'
import { HeaderField, StorageField } from '../core/constant'

/**
 * 传递登录凭证拦截器
 *
 * [主要用途]
 * 本地存在登录凭证且未过期，则携带在请求头中，否则不进行任何操作。
 */
export function accessTokenInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const headers = config.headers || {}

  const tokenInfo = wx.getStorageSync<TokenInfo>(StorageField.TOKEN)

  if (tokenInfo && tokenInfo.expiration > Date.now()) {
    headers[HeaderField.JWT] = tokenInfo.token
  }

  config.headers = headers
  return config
}
