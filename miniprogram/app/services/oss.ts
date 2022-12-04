import {requestForData} from '../core/http'

/** OSS 临时上传凭证 */
export interface OssPostCredential {
  /** 客户端使用时参数改为 `OSSAccessKeyId` */
  accessKeyId: string

  url: string

  key: string

  policy: string

  signature: string
}

/**
 * 获取阿里云 OSS 直传凭证
 *
 * @see https://help.aliyun.com/document_detail/92883.html
 *
 * @param type 凭证类型：`image` => 图片， `video` => 视频
 */
export function getOssPostCredential(type: string): Promise<OssPostCredential> {
  return requestForData({
    method: 'GET',
    url: '/oss/credential',
    auth: false,
    params: {type},
  })
}

/**
 * 将资源直传至 OSS
 *
 * @param tempFilePath 调用接口获取的本地临时文件路径
 * @param credential 阿里云 OSS 直传凭证
 */
export function uploadToOss(tempFilePath: string, credential: OssPostCredential): WechatMiniprogram.UploadTask {
  return wx.uploadFile({
    filePath: tempFilePath,
    url: credential.url,
    name: 'file',

    formData: {
      key: credential.key,
      policy: credential.policy,
      signature: credential.signature,
      OSSAccessKeyId: credential.accessKeyId,
    },
  })
}

/**
 * 不包含上传进度的上传方法
 */
export function uploadToOssWithoutProgress(tempFilePath: string, credential: OssPostCredential) {
  return new Promise((resolve) => {
    const task = uploadToOss(tempFilePath, credential)
    task.onProgressUpdate((listener) => {
      if (listener.progress === 100) {
        resolve(true)
      }
    })
  })
}
