import {MiniProgramInfo} from './system.interface'

/**
 * 获取小程序的相关信息
 */
export async function getMiniprogramInfo(): Promise<MiniProgramInfo> {
  const [window, system, device, appBase, account, battery, network] = await Promise.all([
    wx.getWindowInfo(),
    wx.getSystemInfoSync(),
    wx.getDeviceInfo(),
    wx.getAppBaseInfo(),
    wx.getAccountInfoSync(),
    wx.getBatteryInfo(),
    wx.getNetworkType(),
  ])

  return {window, system, device, appBase, account, battery, network}
}
