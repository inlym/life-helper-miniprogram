import axios, { AxiosPromise } from 'axios'
import { config } from '../config'
import { Method, miniprogramAdapter } from './miniprogram-adatper'
import { aliyunApigwSignatureInterceptorBuilder } from './aliyun-apigw-signature-interceptor'

const instance = axios.create({
  baseURL: config.baseURL,
  adapter: miniprogramAdapter,
})

instance.interceptors.request.use(aliyunApigwSignatureInterceptorBuilder('204032881', 'Ba3aSmGiqx6bFOuCRTaHUDGf9HI40jOV', true))

/** 内部调用可配置的参数 */
export interface RequestOptions {
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
export function request<T = any>(config: RequestOptions): AxiosPromise<T> {
  return instance({
    method: config.method || 'GET',
    url: config.url,
    params: config.params,
    data: config.data,
  })
}
