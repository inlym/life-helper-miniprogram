import { request } from './request'
import { getCode } from './wxp'
import { STO_TOKEN } from './contants'

export interface LoginResponse {
  token: string
}

export async function login() {
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
