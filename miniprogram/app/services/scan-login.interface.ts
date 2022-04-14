/** 进行扫码、确认登录操作后的响应数据 */
export interface ScanLoginResult {
  /** 状态 */
  status: number

  /** IP 地址 */
  ip: string

  /** IP 地址所在区域，包含省和市，例如：浙江省杭州市 */
  region: string
}

/** 扫码登录状态 */
export enum ScanLoginStatus {
  /** 已失效 */
  INVALID = -1,

  /** 已创建 */
  CREATED = 0,

  /** 已扫码但未确认 */
  SCANNED = 1,

  /** 已扫码确认 */
  CONFIRMED = 2,
}
