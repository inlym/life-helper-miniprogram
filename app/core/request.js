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
 * 中间件，添加授权信息
 */
async function auth(ctx, next) {
  const token = wx.getStorageSync(STORAGE_TOKEN_FIElD)

  if (ctx.url.indexOf('/login') === -1 && token) {
    ctx.setHeader('authorization', `TOKEN ${token}`)
  } else {
    const code = await getCode()
    ctx.setHeader('authorization', `CODE ${code}`)
  }

  await next()
}

/**
 * 存储登录凭证
 */
async function saveToken(ctx, next) {
  await next()
  if (ctx.response.data && ctx.response.data.token) {
    wx.setStorageSync(STORAGE_TOKEN_FIElD, ctx.response.data.token)
  }
}

const defaults = {
  method: 'get',
  baseURL: 'https://api.lh.inlym.com',
  middleware: [auth, saveToken],
  responseItems: ['status', 'headers', 'data', 'config'],
}

if (appKey && appSecret) {
  defaults.sign = {
    key: appKey,
    secret: appSecret,
  }
}

module.exports = jshttp.create(defaults)
