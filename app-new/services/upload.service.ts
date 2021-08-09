import { request } from '../core/request'

export interface UploadToken {
  key: string
  policy: string
  signature: string
  OSSAccessKeyId: string
  url: string
}

export interface UploadSuccessResult extends UploadToken {
  path: string
}

/**
 * 获取直传 OSS 的上传凭证
 *
 * @param type 凭证类型
 * @param n 凭证数量
 */
export async function getUploadToken(type = 'picture', n = 1): Promise<UploadToken[]> {
  const response = await request<UploadToken[]>({
    url: '/oss/token',
    params: { type, n },
  })

  return response.data
}

/**
 * 上传资源到 OSS
 *
 * @param path 文件临时路径
 * @param token 上传凭证
 */
export function uploadToOss(path: string, token: UploadToken): Promise<UploadSuccessResult> {
  return new Promise((resolve) => {
    wx.uploadFile({
      url: token.url,
      filePath: path,
      name: 'file',
      formData: {
        key: token.key,
        policy: token.policy,
        OSSAccessKeyId: token.OSSAccessKeyId,
        signature: token.signature,
      },
      success: () => {
        resolve({ path, ...token })
      },
    })
  })
}
