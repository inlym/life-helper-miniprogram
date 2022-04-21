export interface UserInfo {
  /** 用户昵称 */
  nickName: string

  /** 用户头像图片的 URL */
  avatarUrl: string

  /** 资料是否为空 */
  empty?: boolean

  /** 注册天数 */
  registeredDays: number
}
