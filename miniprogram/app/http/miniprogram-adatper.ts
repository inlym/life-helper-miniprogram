import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ParamsUtils } from '../utils/params-utils'

/** 请求方法 */
export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT'

/**
 * 处理请求方法类型
 * @param {string} method 请求方法类型
 */
export function handleMethod(method?: string): Method {
  if (typeof method !== 'string') {
    return 'GET'
  } else {
    return <'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT'>method.toUpperCase()
  }
}

/**
 * Axios 自定义错误
 */
export class AxiosError extends Error {
  config: AxiosRequestConfig

  code: number

  request?: any

  response?: AxiosResponse

  constructor(message: string, config: AxiosRequestConfig, code?: number, request?: any, response?: AxiosResponse) {
    super(message)

    this.config = config
    this.code = code || 0
    this.request = request
    this.response = response
  }

  toJSON() {
    return {
      message: this.message,
      config: this.config,
      code: this.code,
    }
  }
}

/**
 * 微信小程序请求适配器
 * @param {AxiosRequestConfig} config
 */
export function miniprogramAdapter<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  config.params = config.params || {}
  config.headers = config.headers || {}
  config.method = handleMethod(config.method)

  const querystring = ParamsUtils.encode(config.params)
  const wholeUrl = (config.baseURL || '') + (config.url || '') + (querystring ? '?' + querystring : '')

  return new Promise((resolve, reject) => {
    const request = wx.request({
      method: <Method>config.method,
      url: wholeUrl,
      header: config.headers,
      timeout: config.timeout || 10000,
      data: config.data,
      success(res) {
        const response: AxiosResponse = {
          data: res.data,
          status: res.statusCode,
          statusText: 'OK',
          headers: res.header,
          config,
          request,
        }
        if (!response.status || !config.validateStatus || config.validateStatus(response.status)) {
          resolve(response)
        } else {
          reject(new AxiosError(`请求失败，状态码: ${response.status}`, config, response.status, request, response))
        }
      },
      fail(res) {
        reject(new AxiosError(res.errMsg, config))
      },
    })
  })
}
