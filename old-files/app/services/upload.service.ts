import { request } from '../core/request'

export type UploadTokenType = 'video' | 'image'

export interface UploadToken {
  key: string
  policy: string
  signature: string
  OSSAccessKeyId: string
  url: string
}

export interface UploadSuccessResult extends UploadToken {
  tempFilePath: string
}

/**
 * 获取直传 OSS 的上传凭证
 *
 * @param type 凭证类型
 */
export async function getUploadToken(type: UploadTokenType): Promise<UploadToken> {
  const response = await request<UploadToken>({
    method: 'GET',
    url: '/upload/token',
    params: { type },
  })

  return response.data
}

/**
 * 上传资源到 OSS
 *
 * @param type 上传资源类型
 * @param tempFilePath 本地临时文件路径 (本地路径)
 */
export async function uploadToOss(type: UploadTokenType, tempFilePath: string): Promise<UploadSuccessResult> {
  const token = await getUploadToken(type)

  return new Promise((resolve) => {
    wx.uploadFile({
      url: token.url,
      filePath: tempFilePath,
      name: 'file',
      formData: {
        key: token.key,
        policy: token.policy,
        OSSAccessKeyId: token.OSSAccessKeyId,
        signature: token.signature,
      },
      success: () => {
        resolve({ tempFilePath, ...token })
      },
    })
  })
}
