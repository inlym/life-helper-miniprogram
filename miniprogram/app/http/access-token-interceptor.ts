import { AxiosRequestConfig } from 'axios'
import { getToken } from '../core/auth'
import { HeaderField } from '../core/constant'

/**
 * 传递登录凭证拦截器
 *
 * [主要用途]
 * 本地存在登录凭证且未过期，则携带在请求头中，否则不进行任何操作。
 */
export function accessTokenInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = getToken()

  if (token) {
    const headers = config.headers || {}
    headers[HeaderField.JWT] = token
    config.headers = headers
  }

  return config
}
