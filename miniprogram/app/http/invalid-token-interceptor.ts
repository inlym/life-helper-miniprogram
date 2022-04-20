import {AxiosResponse} from 'axios'
import {login} from '../core/auth'
import {StorageField} from '../core/constant'

/**
 * 登录状态失效拦截器
 *
 * ## 主要用途
 * 响应状态码 401 表示未授权，可能是登录凭证失效了，本地清除该登录凭证。
 */
export function invalidTokenInterceptor(response: AxiosResponse): AxiosResponse {
  if (response.status === 401) {
    wx.removeStorageSync(StorageField.TOKEN)
    login()

    wx.showModal({
      title: '提示',
      content: '当前网络环境异常，请稍后重试！',
      showCancel: false,
      confirmText: '我知道了',
    })
  }

  return response
}
