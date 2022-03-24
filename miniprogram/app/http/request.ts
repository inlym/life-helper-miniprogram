import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import { config } from '../config'
import { accessTokenInterceptor } from './access-token-interceptor'
import { aliyunApigwSignatureInterceptorBuilder } from './aliyun-apigw-signature-interceptor'
import { invalidTokenInterceptor } from './invalid-token-interceptor'
import { Method, miniprogramAdapter } from './miniprogram-adatper'
import { requestLogInterceptor } from './request-log-interceptor'

/** 加强版 Axios 请求配置项 */
export interface EnhancedAxiosRequestConfig extends AxiosRequestConfig {
  /** 是否需要登录 */
  needLogin?: boolean
}

const instance = axios.create({
  baseURL: config.baseURL,
  adapter: miniprogramAdapter,
  validateStatus: function (status: number): boolean {
    return status >= 200 && status <= 599
  },
})

instance.interceptors.request.use(aliyunApigwSignatureInterceptorBuilder('204032881', 'Ba3aSmGiqx6bFOuCRTaHUDGf9HI40jOV', false))
instance.interceptors.request.use(accessTokenInterceptor)
instance.interceptors.response.use(invalidTokenInterceptor)
instance.interceptors.response.use(requestLogInterceptor)

/** 内部调用可配置的参数 */
export interface RequestOptions {
  /** 请求方法 */
  method: Method

  /** 请求路径 */
  url: string

  /** 请求参数 */
  params?: Record<string, string | number | boolean>

  /** 请求数据 */
  data?: any

  /** 是否需要登录 */
  needLogin?: boolean
}

/**
 * 封装内部使用的 HTTP 请求客户端
 */
export function request<T = any>(config: RequestOptions): AxiosPromise<T> {
  return instance({
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
    needLogin: config.needLogin || false,
  } as EnhancedAxiosRequestConfig)
}

/**
 * 获取响应数据
 */
export async function requestForData<T = any>(config: RequestOptions): Promise<T> {
  const response = await request(config)
  return response.data
}
