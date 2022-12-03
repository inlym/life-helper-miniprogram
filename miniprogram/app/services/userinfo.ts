/** 用户资料 */
import {requestForData} from '../core/http'

/** 用户地区 */
export interface UserRegion {
  /** 第1级行政区划的 adcode */
  admin1Id: number

  /** 第1级行政区划的简称 */
  admin1ShortName: string

  /** 第2级行政区划的 adcode */
  admin2Id: number

  /** 第2级行政区划的简称 */
  admin2ShortName: string
}

/** 用户信息 */
export interface UserInfo {
  /** 账户 ID */
  accountId: number

  /** 注册时间 */
  registerTime: string

  /** 已注册天数 */
  registeredDays: number

  /** 用户昵称 */
  nickName: string

  /** 头像图片的 URL 地址 */
  avatarUrl: string

  /** 性别：男、女、未知 */
  gender: string

  /** 用户所在地区 */
  region: UserRegion

  /** 用户所在地区名称 */
  regionDisplayName: string
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

export function updateUserInfo(userInfo: UserInfo): Promise<UserInfo> {
  return requestForData({
    method: 'PUT',
    url: '/userinfo',
    data: userInfo,
    auth: true,
  })
}
