/** 用户资料 */
import { requestForData } from '../core/http'

export interface UserInfo {
  /** 用户昵称 */
  nickName: string

  /** 用户头像图片的 URL */
  avatarUrl: string
}

/**
 * 获取用户个人资料
 */
export function getUserInfo(): Promise<UserInfo> {
  return requestForData({
    method: 'GET',
    url: '/userinfo',
    auth: true,
  })
}
