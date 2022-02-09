import { ParamsUtils } from './params-utils'

/**
 * URL 工具
 */
export class UrlUtils {
  /**
   * 拼接 URL，主要用于 Axios 中
   * @param {string} baseURL URL 地址前缀
   * @param {string} url URL 链接或路径
   * @param {Record<string, string | number | boolean>} params 请求参数
   */
  public static combineUrl(baseURL: string, url: string, params?: Record<string, string | number | boolean>): string {
    const querystring = ParamsUtils.encode(params)
    return (baseURL || '') + (url || '') + (querystring ? '?' + querystring : '')
  }
}
