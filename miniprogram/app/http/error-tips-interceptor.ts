import {AxiosResponse} from 'axios'

/**
 * 错误提示拦截器
 */
export function errorTipsInterceptor(response: AxiosResponse): AxiosResponse {
  if (response.data.errorCode) {
    wx.showModal({
      title: '提示',
      content: response.data.errorMessage,
      showCancel: false,
      confirmText: '我知道了',
    }).then(() => {
      throw new Error('a')
    })
  }

  return response
}
