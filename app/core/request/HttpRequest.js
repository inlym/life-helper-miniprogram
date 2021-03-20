'use strict'

const CryptoJS = require('../../ext/crypto-js.min.js')
const qs = require('../qs.js')
const keys = require('../../config/keys.js')

module.exports = class HttpRequest {
  constructor(options) {
    options = options || {}
    this.baseURL = options.baseURL || ''
    this.signed = options.signed || false
    this.stage = 'RELEASE'
    this.debug = options.debug || false

    /** 默认静态 headers */
    this.defaultHeaders = {
      accept: 'application/json',
      'x-ca-stage': this.stage,
      'content-type': 'application/json',
    }

    if (this.signed) {
      this.appKey = options.key || ''
      this.appSecret = options.secret || ''
      this.defaultHeaders['x-ca-key'] = this.appKey
    }

    /** 参加签名的 header */
    this.signHeaderKeys = ['x-ca-nonce', 'x-ca-timestamp'].sort()
  }

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
    const lastDot = wholeUrl.lastIndexOf('.')
    const index = wholeUrl.indexOf('/', lastDot)
    return wholeUrl.substr(index)
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
      const stringToSign = this.buildStringToSign(
        method,
        headers,
        signedHeadersString,
        pathAndParams
      )
      headers['x-ca-signature'] = this.sign(stringToSign)
    }

    if (this.debug) {
      console.log({
        method,
        url,
        headers,
        data: options.data || '',
      })
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: options.data,
        header: headers,
        timeout: options.timeout || 6000,
        method,
        success(res) {
          resolve({
            data: res.data,
            status: res.statusCode,
            headers: res.header,
          })

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
}
