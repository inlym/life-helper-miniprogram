import axios, { AxiosPromise } from 'axios'
import { config } from '../config'
import { Method, miniprogramAdapter } from './miniprogram-adatper'

const instance = axios.create({
  baseURL: config.baseURL,
  adapter: miniprogramAdapter,
})

/** 内部调用可配置的参数 */
export interface RequestConfig {
  /** 请求方法 */
  method?: Method

  /** 请求路径 */
  url: string

  /** 请求参数 */
  params?: Record<string, string | number | boolean>

  /** 请求数据 */
  data?: any
}

/**
 * 封装内部使用的 HTTP 请求客户端
 */
export function request<T = any>(config: RequestConfig): AxiosPromise<T> {
  return instance({
    method: config.method || 'GET',
    url: config.url,
    params: config.params,
    data: config.data,
  })
}
