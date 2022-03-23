/** 用户信息数据 */
import { http } from '../core/http'

export interface Userinfo {
  /** 用户昵称 */
  nickName: string

  /** 用户头像图片的 URL */
  avatarUrl: string
}

/**
 * 获取个人信息（头像和昵称）
 */
export async function getUserInfo(): Promise<Userinfo> {
  return http.get<Userinfo>('/userinfo')
}
