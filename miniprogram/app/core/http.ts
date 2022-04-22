import {AxiosRequestConfig} from 'axios'
import {request} from '../http/request'
import {RequestOptionsInternal} from '../http/types'

/**
 * 获取请求数据
 */
export async function requestForData<T = any>(options: RequestOptionsInternal): Promise<T> {
  const response = await request(options as unknown as AxiosRequestConfig)
  return response.data
}
