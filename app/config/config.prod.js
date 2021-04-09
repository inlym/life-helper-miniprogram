'use strict'

const secret = require('life-helper-miniprogram-secret')

module.exports = {
  /** 服务端域名 */
  baseURL: 'https://api.lh.inlym.com',

  /** 是否需要对请求进行签名 */
  signature: true,

  /** 向 OSS 直传文件时，设定的回调地址前缀 */
  ossCallbackUrl: 'https://api.lh.inlym.com/oss/callback',

  secret: secret('prod'),
}
