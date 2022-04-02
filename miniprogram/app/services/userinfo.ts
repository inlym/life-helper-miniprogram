/** 用户资料 */
import {requestForData} from '../core/http'
import {UserInfo} from './userinfo.interface'

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

export function updateUserInfo(userInfo: UserInfo): Promise<UserInfo> {
  return requestForData({
    method: 'PUT',
    url: '/userinfo',
    data: userInfo,
    auth: true,
  })
}
