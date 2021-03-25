'use strict'

const CryptoJS = require('../ext/crypto-js.min.js')
const qs = require('./qs.js')
const keys = require('../config/keys.js')
const logger = require('./logger.js')
const base64 = require('../ext/base64.js')
const config = require('../config/config.js')

module.exports = class HttpRequest {
  // 仅将一些分环境不同的配置项放置到入口配置处
  constructor(options) {
    options = options || {}

    /** 所有 API 的公共 url 前缀部分 */
    this.baseURL = options.baseURL || ''

    /** 是否需要签名，当前为阿里云 API 网关验证 */
    this.signed = options.signed || false

    /** 线上还是预发布、测试环境等 */
    this.stage = 'RELEASE'

    /** 是否开始调试模式 */
    this.debug = options.debug || false

    /** 默认静态 headers */
    this.defaultHeaders = {
      accept: 'application/json',
      'x-ca-stage': this.stage,
      'content-type': 'application/json',
    }

    if (this.signed) {
      this.appKey = options.appKey
      this.appSecret = options.appSecret
      this.defaultHeaders['x-ca-key'] = this.appKey

      if (!(this.appKey && this.appSecret)) {
        throw new Error('未配置 appKey 或 appSecret')
      }
    }

    /** 参加签名的 header */
    this.signHeaderKeys = ['x-ca-nonce', 'x-ca-timestamp'].sort()
  }

  /** 获取小程序版本信息，用于附在 x-lh-miniprogram 请求头中 */
  getMPInfoString() {
    return qs.stringify(wx.getAccountInfoSync().miniProgram).replace(/&/gu, '; ')
  }

  /** 签名 */
  sign(stringToSign) {
    return CryptoJS.HmacSHA256(stringToSign, this.appSecret).toString(CryptoJS.enc.Base64)
  }

  md5(content) {
    return CryptoJS.MD5(content).toString(CryptoJS.enc.Base64)
  }

  /** 生成随机字符串，目前用于 x-ca-nonce 请求头中（备注：后续替代为 UUID） */
  randomString() {
    return CryptoJS.MD5(Date.now().toString() + Math.random() * 10000).toString(CryptoJS.enc.Hex)
  }

  getSignedHeadersString(headers) {
    const signHeaderKeys = this.signHeaderKeys
    const list = []
    for (let i = 0; i < signHeaderKeys.length; i++) {
      const key = signHeaderKeys[i]
      const value = headers[key]
      list.push(key + ':' + (value ? value : ''))
    }
    return list.join('\n')
  }

  buildHeaders(headers = {}) {
    const headerKeys = Object.keys(headers)
    const result = {}
    for (let i = 0; i < headerKeys.length; i++) {
      const key = headerKeys[i]
      if (headers[key]) {
        // 去除空的 header 以及将属性名改为小写
        result[key.toLowerCase()] = headers[key]
      }
    }
    return Object.assign({}, this.defaultHeaders, result)
  }

  /** 拼接微信请求需要的 url 格式 */
  buildUrl(baseURL, url, params) {
    let result = baseURL || ''

    if (url) {
      if (url.indexOf('https:') !== -1 || url.indexOf('http:') !== -1) {
        // 如果 url 是绝对路径，那么就不用 baseURL
        result = url
      } else {
        // 两段拼接，可能前者后面和后者前面带有 '/' ，若有则去掉
        result = result.replace(/\/+$/u, '') + '/' + url.replace(/^\/+/u, '')
      }
    }

    if (params) {
      const str = qs.stringify(params)
      if (str) {
        if (result.indexOf('?') === -1) {
          result = result.replace(/\/+$/u, '') + '?' + str
        } else {
          result = result.replace(/\/+$/u, '') + '&' + str
        }
      }
    }

    return result
  }

  getPathAndParams(wholeUrl) {
    const urlRaw = wholeUrl.replace('https://', '').replace('http://', '')
    return urlRaw.substr(urlRaw.indexOf('/'))
  }

  buildStringToSign(method, headers, signedHeadersString, pathAndParams) {
    const lf = '\n'
    const list = [method.toUpperCase(), lf]

    const arr = ['accept', 'content-md5', 'content-type', 'date']
    for (let i = 0; i < arr.length; i++) {
      const key = arr[i]
      if (headers[key]) {
        list.push(headers[key])
      }
      list.push(lf)
    }

    if (signedHeadersString) {
      list.push(signedHeadersString)
      list.push(lf)
    }

    if (pathAndParams) {
      list.push(pathAndParams)
    }

    return list.join('')
  }

  async request(options) {
    const startTime = Date.now()
    const method = (options.method && options.method.toUpperCase()) || 'GET'
    const headers = this.buildHeaders(options.headers)
    headers['x-ca-timestamp'] = Date.now()
    headers['x-ca-nonce'] = this.randomString()
    headers[keys.HEADER_MPINFO_FIElD] = this.getMPInfoString()

    if (method !== 'GET' && options.data) {
      headers['content-md5'] = this.md5(JSON.stringify(options.data))
    }

    const url = this.buildUrl(this.baseURL, options.url, options.params)

    const token = wx.getStorageSync(keys.STORAGE_TOKEN_FIElD)
    if (token) {
      headers[keys.HEADER_TOKEN_FIElD] = token
    } else {
      const code = await this.getCode()
      headers[keys.HEADER_CODE_FIElD] = code
    }

    if (this.signed) {
      headers['x-ca-signature-headers'] = this.signHeaderKeys.join(',')
      const pathAndParams = this.getPathAndParams(url)
      const signedHeadersString = this.getSignedHeadersString(headers)
      const stringToSign = this.buildStringToSign(method, headers, signedHeadersString, pathAndParams)
      headers['x-ca-signature'] = this.sign(stringToSign)
    }

    const debug = this.debug

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: options.data,
        header: headers,
        timeout: options.timeout || 6000,
        method,
        enableHttp2: true,
        enableQuic: true,
        success(res) {
          resolve({
            data: res.data,
            status: res.statusCode,
            headers: res.header,
          })

          if (debug) {
            const endTime = Date.now()
            const cost = endTime - startTime
            logger.debug(`[Request] [${cost}ms]`, method, url)
          }

          if (res.statusCode === 401) {
            wx.removeStorageSync(keys.STORAGE_TOKEN_FIElD)
          }
        },
        fail() {
          reject(new Error('内部原因，发起请求失败!'))
        },
      })
    })
  }

  /**
   * 本地图片直传 OSS
   * @param {object} opt 配置项
   * @description
   * 1. 调用该函数前需先获取 ossToken
   */
  uploadSingleImageToOss(opt) {
    /** 有效的图片文件后缀名 */
    const validExtname = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'tiff', 'svg']

    const { filePath, ossToken } = opt
    const { basename, policy, accessKeyId, signature, url } = ossToken

    const token = wx.getStorageSync(keys.STORAGE_TOKEN_FIElD)

    if (!(filePath && url && basename && policy && accessKeyId && signature)) {
      throw new Error('调用函数 uploadSingleImageToOss 时缺少参数')
    }

    const fileNameList = filePath.split('.')
    const extname = fileNameList[fileNameList.length - 1]
    if (!validExtname.includes(extname.toLowerCase())) {
      throw new Error('不支持的图片后缀')
    }

    /** 文件名 */
    const key = basename + '.' + extname

    const callback = {
      callbackUrl: config.ossCallbackUrl + '?token=' + token,
      callbackBodyType: 'application/json',
      callbackBody:
        '{"bucket":${bucket},"object":${object},"etag":${etag},"size":${size},"height":${imageInfo.height},"width":${imageInfo.width},"format":${imageInfo.format}}',
    }

    return new Promise((resolve) => {
      wx.uploadFile({
        url,
        filePath,
        name: 'file',
        formData: {
          key,
          policy,
          OSSAccessKeyId: accessKeyId,
          signature,
          success_action_status: 200,
          callback: base64.encode(JSON.stringify(callback)),
        },
        success(res) {
          if (res.statusCode < 300) {
            resolve(key)
          } else {
            resolve(false)
          }
        },
      })
    })
  }

  get(opt) {
    if (typeof opt === 'string') {
      return this.request({
        method: 'GET',
        url: opt,
      })
    } else if (typeof opt === 'object') {
      opt.method = 'GET'
      return this.request(opt)
    } else {
      throw new Error('未支持的参数类型')
    }
  }

  post(opt) {
    if (typeof opt === 'object') {
      opt.method = 'POST'
      return this.request(opt)
    } else {
      throw new Error('未支持的参数类型')
    }
  }

  getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res.code)
        },
        fail() {
          reject(new Error('内部原因，获取 code 失败!'))
        },
      })
    })
  }

  async login() {
    const code = await this.getCode()
    this.get({
      url: '/login',
      params: {
        code,
      },
    }).then((response) => {
      if (response.status === 200) {
        const { token } = response.data
        wx.setStorageSync(keys.STORAGE_TOKEN_FIElD, token)
        wx.setStorageSync(keys.STORAGE_LAST_LOGIN_TIME, Date.now())
      } else {
        wx.showModal({
          title: '提示',
          content: '你当前所处位置的网络较差，你可以切换网络后重新进入小程序！',
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })
  }

  /** 创建新的实例 */
  static create(config) {
    const { baseURL, signature, httpDebug } = config
    const { appKey, appSecret } = config.secret || {}
    return new HttpRequest({
      baseURL,
      debug: httpDebug,
      signed: signature,
      appKey,
      appSecret,
    })
  }
}
