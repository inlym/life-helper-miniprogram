'use strict'

/**
 * 小程序直传 OSS 文档
 * @see https://help.aliyun.com/document_detail/92883.html
 */

const request = require('../core/request')

/**
 * 获取直传 OSS 的凭证
 * @param {string} type 凭证类型
 */
async function getToken(type = 'picture', n = 1) {
  const response = await request({
    url: '/oss/token',
    params: { type, n },
  })
  return response.data
}

/**
 * 上传资源到 OSS
 * @param {string} path 资源的临时路径
 * @param {Object} token OSS 直传凭证
 */
function uploadToOss(path, token) {
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

module.exports = { getToken, uploadToOss }
