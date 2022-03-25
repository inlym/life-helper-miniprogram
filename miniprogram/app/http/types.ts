/** 内部调用使用的请求参数 */
export interface RequestOptionsInternal {
  /** 内部调用使用的请求参数 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  /** 请求地址 */
  url: string

  /** 请求参数 */
  params?: Record<string, string | number | undefined>

  /** 请求数据 */
  data?: Record<string, any>

  /** 是否需要登录 */
  auth: boolean
}
