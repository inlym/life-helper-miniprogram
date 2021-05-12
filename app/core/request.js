'use strict'

const jshttp = require('jshttp')
const config = require('../config/config.js')

const { appKey, appSecret } = config.secret || {}

/** 在小程序 storage 中用于存储 token 的字段名 */
const STORAGE_TOKEN_FIElD = '__app_token__'

/**
 * 封装获取 code 方法
 */
function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res.code)
      },
      fail() {
        reject(new Error('调用 wx.login 失败!'))
      },
    })
  })
}

/**
 * 中间件：添加授权信息
 */
async function auth(ctx, next) {
  const token = wx.getStorageSync(STORAGE_TOKEN_FIElD)

  if (ctx.url.indexOf('/login') === -1 && token && ctx.retries === 0) {
    ctx.setHeader('authorization', `TOKEN ${token}`)
  } else {
    const code = await getCode()
    ctx.setHeader('authorization', `CODE ${code}`)
  }

  await next()
}

/**
 * 中间件：存储登录凭证
 */
async function saveToken(ctx, next) {
  await next()
  if (ctx.response.data && ctx.response.data.token) {
    wx.setStorageSync(STORAGE_TOKEN_FIElD, ctx.response.data.token)
  }
}

/**
 * 错误提示
 *
 * 说明：
 * 1. 人为控制的错误提示返回状态码 200
 */
async function errTips(ctx, next) {
  await next()
  if (ctx.response.status === 200 && ctx.response.data && ctx.response.data.code && ctx.response.data.message) {
    const { type, options } = ctx.response.data.message
    if (type === 'toast') {
      wx.showToast(options)
    } else if (type === 'modal') {
      wx.showModal(options)
    } else {
      // 空
    }
  }
}

/**
 * 默认配置
 */
const defaults = {
  method: 'get',
  baseURL: config.baseURL,
  middleware: [auth, saveToken, errTips],
  retry: 1,
  responseItems: ['status', 'headers', 'data', 'config'],
}

if (appKey && appSecret) {
  defaults.sign = {
    key: appKey,
    secret: appSecret,
  }
}

module.exports = jshttp.create(defaults)
