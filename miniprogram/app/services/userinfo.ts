/** 用户资料 */
import {StorageField} from '../core/constant'
import {requestForData} from '../core/http'
import {Storage, storage} from '../core/storage'
import {getOssPostCredential, uploadToOssWithoutProgress} from './oss'

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

/** 修改用户信息提交的数据 */
export interface UpdateUserInfo {
  /** 用户昵称 */
  nickName: string

  /** 头像图片的 URL 地址 */
  avatarUrl: string

  /**
   * 性别
   *
   * ### 值范围
   * - [1] - 男
   * - [2] - 女
   */
  genderType: number

  /** 所在城市的 adcode */
  cityId: number
}

/**
 * 获取用户个人资料
 *
 * ### 备注
 * 由于多个页面均用到用户信息，使用页面传值较为繁琐，因此使用全局缓存
 */
export async function getUserInfo(): Promise<UserInfo> {
  const cacheData = storage.get<UserInfo>(StorageField.USER_INFO)
  if (cacheData) {
    return cacheData
  } else {
    const data = await requestForData({
      method: 'GET',
      url: '/userinfo',
      auth: true,
    })

    storage.set(StorageField.USER_INFO, data, Storage.ofMinutes(30))
    return data
  }
}

/**
 * 修改用户信息
 *
 * @param userInfo 要修改的用户信息
 */
export async function updateUserInfo(userInfo: Partial<UpdateUserInfo>): Promise<UserInfo> {
  const data = await requestForData({
    method: 'PUT',
    url: '/userinfo',
    data: userInfo,
    auth: true,
  })

  storage.set(StorageField.USER_INFO, data, Storage.ofMinutes(30))
  return data
}

/**
 * 修改头像
 *
 * @param avatarUrl 本地临时头像图片地址
 */
export async function updateAvatar(avatarUrl: string): Promise<UserInfo> {
  const credential = await getOssPostCredential('image')
  await uploadToOssWithoutProgress(avatarUrl, credential)

  const newAvatarUrl = credential.url + '/' + credential.key
  return updateUserInfo({avatarUrl: newAvatarUrl})
}

/**
 * 修改昵称
 *
 * @param nickName 新的昵称
 */
export async function updateNickName(nickName: string) {
  return updateUserInfo({nickName})
}

/**
 * 修改性别
 *
 * @param genderType 新的性别类型
 */
export async function updateGenderType(genderType: number) {
  return updateUserInfo({genderType})
}

/**
 * 修改地区
 *
 * @param cityId 地区对应的 adcode
 */
export async function updateRegion(cityId: number) {
  return updateUserInfo({cityId})
}
