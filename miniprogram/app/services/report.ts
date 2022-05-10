import {requestForData} from '../core/http'
import {LaunchInfo} from './report.interface'
import {getMiniprogramInfo} from './system'

/**
 * 上报小程序基本信息
 */
export async function reportMiniprogramBasicInfo() {
  const mpInfo = await getMiniprogramInfo()
  const launchInfo: LaunchInfo = {reportTime: Date.now(), ...mpInfo}

  return requestForData({
    method: 'POST',
    url: '/report/miniprogram/launch',
    data: launchInfo,
    auth: true,
  })
}
