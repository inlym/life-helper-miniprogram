import {requestForData} from '../core/http'
import {IpInfo} from './ip.interface'

export function getIpInfo(): Promise<IpInfo> {
  return requestForData({
    method: 'GET',
    url: '/ip',
    auth: false,
  })
}
