/**
 * 扫码登录相关方法
 *
 * @date 2022-04-14
 */

import {requestForData} from '../core/http'
import {ScanLoginResult} from './scan-login.interface'

/**
 * 进行 "扫码" 操作
 */
export function scanQrcode(ticket: string): Promise<ScanLoginResult> {
  return requestForData({
    method: 'PUT',
    url: '/scan_login',
    params: {operator: 'scan'},
    data: {ticket},
    auth: true,
  })
}

/**
 * 进行 "确认登录" 操作
 */
export function confirmQrcode(ticket: string): Promise<ScanLoginResult> {
  return requestForData({
    method: 'PUT',
    url: '/scan_login',
    params: {operator: 'confirm'},
    data: {ticket},
    auth: true,
  })
}
