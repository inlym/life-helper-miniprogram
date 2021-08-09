import { STO_TOKEN } from './contants'
import { request } from './request'
import { getCode } from './wxp'

export interface LoginResponse {
  token: string
}

/**
 * 登录
 *
 * @returns 登录凭证
 */
export async function login(): Promise<string> {
  const code: string = await getCode()
  const response = await request<LoginResponse>({
    url: '/login',
    headers: { authorization: `CODE ${code}` },
  })

  if (response.data.token) {
    wx.setStorageSync(STO_TOKEN, response.data.token)
    return response.data.token
  } else {
    wx.showToast({
      title: '登录失败！',
      icon: 'none',
    })
    return ''
  }
}
