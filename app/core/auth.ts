import { STO_TOKEN } from './contants'
import { request } from './request'
import { getCode } from './wxp'

/** 登录接口响应数据 */
export interface LoginResponse {
  /** 有效时长，单位：秒 */
  expiration: number

  /** 登录凭证 */
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
    method: 'GET',
    url: '/login',
    headers: { authorization: `CODE ${code}` },
  })

  if (response.data.token) {
    /** 到期时间的时间戳 */
    const expiration = response.data.expiration * 1000 + Date.now()
    wx.setStorageSync(STO_TOKEN, { token: response.data.token, expiration })
    return response.data.token
  } else {
    wx.showToast({
      title: '登录失败！',
      icon: 'none',
    })
    return ''
  }
}

export interface Session {
  /** 到期时间的时间戳 */
  expiration: number

  /** 登录凭证 */
  token: string
}

/**
 * 获取登录凭证（返回空字符串表示无有效凭证）
 */
export function getToken(): string {
  const session: Session = wx.getStorageSync(STO_TOKEN)
  if (session && session.expiration > Date.now()) {
    return session.token
  }
  return ''
}

/**
 * 确保已登录
 */
export async function ensureLogined(): Promise<void> {
  const token = getToken()
  if (!token) {
    await login()
  }
}
