import {AxiosRequestConfig} from 'axios'
import {SecurityToken} from '../core/auth'
import {StorageField} from '../core/constant'
import {enhancedStorage} from '../core/storage'
import dayjs from 'dayjs'

/**
 * 登录凭证拦截器
 *
 * ## 主要用途
 * 本地存在登录凭证且未过期，则携带在请求头中，否则不进行任何操作。
 */
export function securityTokenInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const securityToken = enhancedStorage.get<SecurityToken>(StorageField.TOKEN)

  if (securityToken && dayjs(securityToken.expireTime).isAfter(dayjs())) {
    const headers = config.headers || {}
    headers[securityToken.headerName] = securityToken.token
    config.headers = headers
  }

  return config
}
