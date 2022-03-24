import { handleMethod, Method } from './miniprogram-adatper'
import { AxiosRequestConfig } from 'axios'
import { ParamsUtils } from '../utils/params-utils'
import * as CryptoJS from 'crypto-js'

/**
 * 规格化请求头
 *
 * [说明]
 * 1. 将字段名统一变为小写
 * 2. 去除重复的请求头
 * @param {Record<string, string>} headers
 */
function normalizeHeaders(headers: Record<string, string>): Record<string, string> {
  if (typeof headers !== 'object') {
    return {}
  }

  /** 放在 `config.headers` 中但是非正常请求头字段的字段 */
  const axiosExtraHeaderFieldList = ['common', 'delete', 'get', 'head', 'patch', 'post', 'put']
  const result: Record<string, string> = {}

  Object.keys(headers).forEach((name: string) => {
    const lowerName = name.toLowerCase()
    if (!result[lowerName] && headers[name] && !axiosExtraHeaderFieldList.includes(name)) {
      result[lowerName] = headers[name]
    }
  })

  return result
}

/**
 * 获取参与签名的请求头列表
 * @param {Record<string, string>} headers 请求头
 */
function getSignHeaderKeys(headers: Record<string, string>): string[] {
  /** 不参与 Header 签名的请求头 */
  const EXCLUDE_SIGN_HEADERS = ['x-ca-signature', 'x-xa-signature-headers', 'accept', 'content-md5', 'content-type', 'date']

  return Object.keys(headers)
    .filter((name: string) => {
      return !EXCLUDE_SIGN_HEADERS.includes(name)
    })
    .sort()
}

function getSignedHeadersString(signHeaderKeys: string[], headers: Record<string, string>): string {
  return signHeaderKeys
    .map((key: string) => {
      const value = headers[key]
      return key + ':' + (value ? value : '')
    })
    .join('\n')
}

function getPathAndParams(url: string): string {
  const urlRaw = url.replace('https://', '').replace('http://', '')
  return urlRaw.substr(urlRaw.indexOf('/'))
}

function md5(content: string): string {
  return CryptoJS.MD5(content).toString(CryptoJS.enc.Base64)
}

function buildStringToSign(method: Method, headers: Record<string, string>, signedHeadersString: string, pathAndParams: string) {
  const lf = '\n'
  const list: string[] = [method.toUpperCase(), lf]

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

/**
 * 阿里云 API 网关签名拦截器
 * @see https://help.aliyun.com/document_detail/29475.html
 */
export function aliyunApigwSignatureInterceptorBuilder(appKey: string, appSecret: string, debug = true) {
  return function aliyunApigwSignatureInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    const headers = normalizeHeaders(config.headers)

    // 给请求头添加一些要求添加的字段
    headers['x-ca-key'] = appKey
    headers['x-ca-timestamp'] = Date.now().toString()
    headers['accept'] = headers['accept'] || '*/*'
    headers['content-type'] = headers['content-type'] || 'application/json'

    // 该请求头要求为一个随机字符串，理论上使用 `UUID` 更好，为了少引入依赖，使用这种方法
    headers['x-ca-nonce'] = CryptoJS.MD5(Date.now().toString() + Math.random() * 10000).toString(CryptoJS.enc.Hex)

    if (config.data) {
      headers['content-md5'] = md5(JSON.stringify(config.data))
    }

    const signHeaderKeys = getSignHeaderKeys(headers)
    headers['x-ca-signature-headers'] = signHeaderKeys.join(',')

    const querystring = ParamsUtils.encode(config.params)
    const wholeUrl = (config.baseURL || '') + (config.url || '') + (querystring ? '?' + querystring : '')
    const pathAndParams = getPathAndParams(wholeUrl)
    const signedHeadersString = getSignedHeadersString(signHeaderKeys, headers)
    const stringToSign = buildStringToSign(handleMethod(config.method), headers, signedHeadersString, pathAndParams)
    headers['x-ca-signature'] = CryptoJS.HmacSHA256(stringToSign, appSecret).toString(CryptoJS.enc.Base64)

    if (debug) {
      console.info(`当前签名字符串：\`${stringToSign.replace(/\n/g, '#')}\``)
    }

    config.headers = headers
    return config
  }
}
