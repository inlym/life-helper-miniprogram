/** 系统详情 */
export interface SystemDetail {
  // --------------------------------------------------------------------------
  // 以下字段来源于 `wx.getSystemInfoSync` 方法
  // --------------------------------------------------------------------------

  /** 设备品牌 */
  brand: string

  /** 设备型号 */
  model: string

  /** 微信设置的语言 */
  language: string

  /** 微信版本号 */
  version: string

  /** 操作系统及版本 */
  system: string

  /** 客户端平台：`ios`, `android`, `windows`, `mac` */
  platform: string

  /** 系统当前主题，取值为 `light` 或 `dark` */
  theme: string

  // --------------------------------------------------------------------------
  // 以下字段来源于 `wx.getBatteryInfoSync` 方法
  // --------------------------------------------------------------------------

  /** 设备电量，范围 1 - 100 */
  batteryLevel: number

  /** 是否正在充电中 */
  isCharging: boolean

  // --------------------------------------------------------------------------
  // 以下字段来源于 `wx.getNetworkType` 方法
  // --------------------------------------------------------------------------

  /** 网络类型 */
  networkType: string

  /** 信号强弱，单位 dbm */
  signalStrength: number

  /** 设备是否使用了网络代理 */
  hasSystemProxy: boolean
}
