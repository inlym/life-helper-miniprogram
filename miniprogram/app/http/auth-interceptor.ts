import {AxiosRequestConfig} from 'axios'
import {hasValidSecurityToken, login} from '../core/auth'
import {RequestOptionsInternal} from './types'

/**
 * 登录鉴权拦截器
 *
 * ### 主要用途
 * 对于需要鉴权的 API，判断是否获取登录凭证，若无则先登录再请求。
 */
export async function authInterceptor(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  const auth = (config as unknown as RequestOptionsInternal).auth

  if (auth && !hasValidSecurityToken()) {
    await login()
  }

  return config
}
