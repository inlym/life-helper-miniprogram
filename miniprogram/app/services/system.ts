import {SystemDetail} from './system.interface'

export async function getSystemDetail(): Promise<SystemDetail> {
  const [systemInfo, batteryInfo, networkType] = await Promise.all([
    wx.getSystemInfoSync(),
    wx.getBatteryInfo(),
    wx.getNetworkType(),
  ])

  const detail: SystemDetail = {
    brand: systemInfo.brand,
    model: systemInfo.model,
    language: systemInfo.language,
    version: systemInfo.version,
    system: systemInfo.system,
    platform: systemInfo.platform,
    theme: systemInfo.theme,

    batteryLevel: batteryInfo.level,
    isCharging: batteryInfo.isCharging,

    networkType: networkType.networkType,
    signalStrength: networkType.signalStrength,
    hasSystemProxy: networkType.hasSystemProxy,
  }

  return detail
}
