import { request } from '../http/request'

/**
 * 封装内部使用的 HTTP 客户端
 */
export class Http {
  async get<T = any>(url: string): Promise<T>
  async get<T = any>(url: string, params?: Record<string, string | boolean | number>): Promise<T> {
    const response = await request({
      method: 'GET',
      url: url,
      params: params,
    })

    return response.data
  }

  async post<T = any>(url: string, data: any): Promise<T> {
    const response = await request({
      method: 'POST',
      url: url,
      data: data,
    })

    return response.data
  }
}

/**
 * 内部调用只使用 `http.method` 方法
 */
export const http = new Http()
