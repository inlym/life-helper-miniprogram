import {requestForData} from '../core/http'
import {CommonResponse} from '../utils/types'

/** 扫码登录凭据 */
export interface QrCodeTicket extends CommonResponse {
  /** 票据 ID */
  id: string
  /** 小程序码图片的 URL 地址 */
  url: string
  /** IP 地址 */
  ip: string
  /** 地区信息 */
  region: string
}

/**
 * 进行 "扫码" 操作
 */
export function scanQrcode(id: string): Promise<QrCodeTicket> {
  return requestForData({
    method: 'PUT',
    url: `/login/qrcode/scan/${id}`,
    auth: true,
  })
}

/**
 * 进行 "确认登录" 操作
 */
export function confirmQrcode(id: string): Promise<QrCodeTicket> {
  return requestForData({
    method: 'PUT',
    url: `/login/qrcode/confirm/${id}`,
    auth: true,
  })
}
