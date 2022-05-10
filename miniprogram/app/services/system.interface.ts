/**
 * 小程序基础信息
 *
 * ## 说明
 * （1）将能够获取到的小程序基础信息汇总起来
 * （2）由于直接将返回值上传，不对数据做二次处理，所以每个类型就都直接标记为 any 了。
 */
export interface MiniProgramInfo {
  /**
   * 窗口信息
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html
   */
  window: any

  /**
   * 系统信息
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfoSync.html
   */
  system: any

  /**
   * 设备基础信息
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html
   */
  device: any

  /**
   * 微信APP基础信息
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppBaseInfo.html
   */
  appBase: any

  /**
   * 当前帐号信息
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
   */
  account: any

  /**
   * 设备电量
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfo.html
   */
  battery: any

  /**
   * 网络类型
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html
   */
  network: any
}
