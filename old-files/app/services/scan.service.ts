import { request } from '../core/request'

/**
 * 扫码登录小程序码
 *
 * @param code 检验码
 */
export async function scanQrcode(code: string): Promise<void> {
  await request({
    method: 'POST',
    url: '/login/confirm',
    params: { type: 'scan' },
    data: { code },
  })
}

/**
 * 确认扫码登录
 *
 * @param code 检验码
 */
export async function confirmQrcode(code: string): Promise<void> {
  await request({
    method: 'POST',
    url: '/login/confirm',
    params: { type: 'confirm' },
    data: { code },
  })
}
