'use strict'

const wxp = require('./wxp.js')

/** token 在请求头中的字段名 */
const HEADER_FIELD_TOKEN = 'X-Lh-Token'

/** code 在请求头中的字段名 */
const HEADER_FIELD_CODE = 'X-Lh-Code'

/** 登录接口的路径地址 */
const LOGIN_API_PATH = '/login'

/**
 * 增加鉴权逻辑的请求封装
 * @param {!object} options 请求参数对象
 */
async function requestWrap(options) {
  if (options === null || typeof options !== 'object') {
    throw new Error('请求参数错误')
  }

  options.header = options.header || options.headers || {}

  // 非登录接口（以 /login 开头）请求头按需自动携带 token 和 code
  if (options.url.indexOf(LOGIN_API_PATH) === -1) {
    const token = wx.getStorageSync('token')

    if (token) {
      // 本地存储有 token，则只需传递 token 即可（若该 token 无效，则响应会返回 401 错误码）
      options.header[HEADER_FIELD_TOKEN] = token
    } else {
      // 没有 token 才去取 code，实测获取 code 的耗时大概在 500ms 以上
      const { code } = await wxp.login()
      options.header[HEADER_FIELD_CODE] = code
    }
  }

  return requestBase(options)
}

/**
 * 对原生 wx.request 的简单封装
 * @param {!object} options 请求参数对象
 * @returns {Promise<{data:string | object;status:number;header:object;}>}
 */
function requestBase(options) {
  const baseURL = options.baseURL || ''
  const url = options.url || ''
  const query = options.query || options.params || {}
  const data = options.data
  const header = options.header || options.headers || {}
  const method = (options.method && options.method.toUpperCase()) || 'GET'

  const combinedURL = buildURL(baseURL, url, query)

  return new Promise((resolve, reject) => {
    wx.request({
      url: combinedURL,
      data,
      header,
      method,
      success(res) {
        Object.defineProperty(res, 'status', {
          get: function () {
            return this.statusCode
          },
        })

        Object.defineProperty(res, 'headers', {
          get: function () {
            return this.header
          },
        })

        resolve(res)
      },
      fail(err) {
        reject(new Error(err))
      },
    })
  })
}

/**
 * 将三个 url 相关参数（baseURL, url, query）组合，生成最终的请求 url
 * @param {!string} baseURL
 * @param {!string} url
 * @param {!Object} query
 */
function buildURL(baseURL, url, query) {
  /** 查询字符串多个属性之间的分隔符 */
  const SEP_CHAR = '&'

  /** 查询字符串单个属性内属性名和属性值的分隔符 */
  const EQ_CHAR = '='

  /** 问号分隔符，用于分隔路径和查询字符串 */
  const QUESTION_CHAR = '?'

  /** 判断绝对路径的正则表达式 */
  const absoluteURLReg = /^([a-z][a-z\d\+\-\.]*:)?\/\//i

  /** 最终组合的 URL */
  let combinedURL = ''

  // 组合 baseURL 和 url
  if (baseURL) {
    if (!absoluteURLReg.test(baseURL)) {
      throw new Error(`baseURL => ${baseURL} 不是一个绝对路径`)
    }

    if (url) {
      if (absoluteURLReg.test(url)) {
        throw new Error('baseURL 和 url 不能同时为绝对路径')
      }
      combinedURL = baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '')
    } else {
      combinedURL = baseURL
    }
  } else {
    combinedURL = url
  }

  if (!absoluteURLReg.test(combinedURL)) {
    throw new Error('baseURL 和 url 均为非绝对路径，无法发起请求')
  }

  /** ['name=mark', 'age=19'] 形式的数组 */
  let qsArr = []

  // 处理 query，转化为 name=mark&age=19 的形式
  Object.getOwnPropertyNames(query).forEach((key) => {
    if (query[key]) {
      qsArr.push(`${key}${EQ_CHAR}${query[key]}`)
    }
  })

  const serializedQueryString = qsArr.join(SEP_CHAR)

  if (serializedQueryString) {
    combinedURL =
      combinedURL.replace(/\/+$/, '') +
      (combinedURL.indexOf(QUESTION_CHAR) === -1 ? QUESTION_CHAR : SEP_CHAR) +
      serializedQueryString
  }

  return combinedURL
}

module.exports = {
  requestWrap,
  requestBase,
}
