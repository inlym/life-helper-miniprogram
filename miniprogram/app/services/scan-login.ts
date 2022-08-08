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
export function scanQrCode(id: string): Promise<ScanLoginResult> {
  return requestForData({
    method: 'PUT',
    url: '/login/qrcode',
    params: {operator: 'scan'},
    data: {id},
    auth: true,
  })
}

/**
 * 进行 "确认登录" 操作
 */
export function confirmQrCode(id: string): Promise<ScanLoginResult> {
  return requestForData({
    method: 'PUT',
    url: '/login/qrcode',
    params: {operator: 'confirm'},
    data: {id},
    auth: true,
  })
}
