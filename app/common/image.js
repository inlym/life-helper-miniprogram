'use strict'

const config = require('../config/config.js')

/**
 * 将单张图片上传至服务器
 * @since 0.1.0
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
 *
 * @param {string} filePath 要上传文件资源的路径 (本地路径)
 */
function uploadSingleImage(filePath) {
  const { baseURL, HEADER_FIELD_TOKEN } = config
  const url = '/img'

  return new Promise((resolve) => {
    const token = wx.getStorageSync('token')
    wx.uploadFile({
      url: `${baseURL}${url}`,
      filePath,
      name: 'postImage',
      header: {
        [HEADER_FIELD_TOKEN]: token,
      },
      success(res) {
        resolve(res)
      },
    })
  })
}

module.exports = {
  uploadSingleImage,
}
