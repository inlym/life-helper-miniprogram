/**
 * HTTP 请求客户端
 *
 * ```markdown
 * 1. 目前 `jshttp` 还未改造好，临时使用自行封装的函数，后续再使用 `jshttp`
 * 2. 由于是内部使用，非工具类库，因此很多设定非常个性化。
 * ```
 */

import { config } from '../config'
import { getToken } from './auth'
import { STO_TOKEN } from './contants'
import { logger } from './logger'
import { makeUrl } from './utils'
import { getCode } from './wxp'

const baseURL = config.baseURL

/**
 * 发起请求时可以配置的参数选项
 */
export interface RequestOptions {
  /** 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  /** URL 地址 */
  url: string

  /** 请求头 */
  headers?: Record<string, string>

  /** 请求参数 */
  params?: Record<string, string | number | boolean | undefined>

  /** 请求数据 */
  data?: any
}

export interface Response<T = any> {
  status: number
  headers: Record<string, string>
  data: T
}

/** 传入微信请求适配器的参数 */
export interface WxRequestOptions {
  /** 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  /** 包含 `host` 部分的完整 URL 地址 */
  url: string

  /** 请求头 */
  headers: Record<string, string>

  /** 请求数据 */
  data?: any
}

/**
 * 将微信原生的 HTTP 请求方法封装为 Promise 形式的函数
 *
 * @param options 请求参数
 */
export function wxRequest<T>(options: WxRequestOptions): Promise<Response<T>> {
  return new Promise((resolve) => {
    wx.request({
      url: options.url,
      data: options.data,
      header: options.headers,
      method: options.method,
      success(res) {
        const response: Response = {
          status: res.statusCode,
          headers: res.header,
          data: res.data,
        }
        resolve(response)
      },
    })
  })
}

/**
 * 外部使用的 HTTP 请求函数，已封装中间件逻辑
 *
 * @param options 请求参数
 */
export async function request<T = any>(options: RequestOptions): Promise<Response<T>> {
  options.headers = options.headers || {}
  options.params = options.params || {}

  const url: string = options.url.startsWith('http') ? makeUrl(options.url, options.params) : makeUrl(baseURL + options.url, options.params)

  // 中间件部分处理逻辑

  const token = getToken()
  if (token && options.url !== '/login') {
    options.headers['authorization'] = `TOKEN ${token}`
  } else {
    const code = await getCode()
    options.headers['authorization'] = `CODE ${code}`
  }

  const wxOptions: WxRequestOptions = {
    method: options.method,
    url,
    headers: options.headers,
    data: options.data,
  }
  const response = await wxRequest<T>(wxOptions)

  if (response.status === 401) {
    wx.removeStorageSync(STO_TOKEN)
  }

  const message = `[HTTP] [${response.status}] [${options.method}] ${url}`

  if (response.status >= 200 && response.status < 300) {
    logger.info(message)
  }

  if (response.status >= 400) {
    logger.error(message)
  }

  return response
}
