import { AxiosResponse } from 'axios'
import { logger } from '../core/logger'
import { UrlUtils } from '../utils/url-utils'

/**
 * 请求日志拦截器
 */
export function requestLogInterceptor(response: AxiosResponse): AxiosResponse {
  const method = response.config.method
  const baseURL = response.config.baseURL
  const url = response.config.url
  const params = response.config.params
  const status = response.status

  const wholeUrl = UrlUtils.combineUrl(baseURL!, url!, params)

  logger.info(`[HTTP] ${status} ${method} ${wholeUrl}`)

  return response
}
