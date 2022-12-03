import {AxiosResponse} from 'axios'

/**
 * 登录状态失效拦截器
 *
 * ## 主要用途
 * 响应状态码 401 表示未授权，可能是登录凭证失效了，本地清除该登录凭证。
 */
export async function invalidTokenInterceptor(response: AxiosResponse): Promise<AxiosResponse> {
  if (response.status === 401) {
    wx.reLaunch({
      url: '/pages/system/error/error',
    })
  }

  return response
}
