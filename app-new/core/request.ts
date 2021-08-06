/**
 * HTTP 请求客户端
 *
 * 1. 目前 `jshttp` 还未改造好，临时使用自行封装的函数，后续再使用 `jshttp`
 * 2. 临时使用
 */

import { config } from '../config'
import { STO_TOKEN } from './contants'
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
  headers: Record<string, string>

  /** 请求参数 */
  params: Record<string, any>

  /** 请求数据 */
  data: any
}

export interface Response {
  status: number
  headers: Record<string, string>
  data: any
}

export function wxRequest(options: RequestOptions) {
  const params = options.params || {}
  const headers = options.headers || {}

  const querystring: string = Object.keys(params)
    .map((key: string) => `${key}=${params[key]}`)
    .sort()
    .join('&')

  const url: string = baseURL + options.url + (querystring ? '?' + querystring : '')

  return new Promise((resolve) => {
    wx.request({
      url,
      data: options.data,
      header: headers,
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

export async function request(options: RequestOptions) {
  options.headers = options.headers || {}

  const token = wx.getStorageSync(STO_TOKEN)
  if (token && options.url !== '/login') {
    options.headers['authorization'] = `TOKEN ${token}`
  } else {
    const code = await getCode()
    options.headers['authorization'] = `CODE ${code}`
  }

  const response: Response = await wxRequest(options)

  if (response.status === 401) {
    wx.removeStorageSync(STO_TOKEN)
  }

  return response
}
