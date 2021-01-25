'use strict'

const configProd = require('./config/config.prod.js')
const configTest = require('./config/config.test.js')
const { requestWrap } = require('./lib/request.js')
const wxp = require('./lib/wxp.js')

App({
  /** 生命周期回调 —— 监听小程序初始化 */
  onLaunch() {
    // 小程序初始化时进行一次登录，从服务端获取 token，保存至缓存中
    this.login()
  },

  /**
   * 环境
   * 'prod' => 生产环境
   * 'test' => 测试环境
   */
  env: 'test',

  /**
   * 配置信息，根据环境变量（env）取对应配置文件
   * 配置文件均放置在 config/ 文件夹下
   */
  get config() {
    const { env } = this
    if (env === 'prod') {
      return configProd
    } else if (env === 'test') {
      return configTest
    } else {
      throw new Error('环境变量 env 配置错误')
    }
  },

  /** Promise 化后的 wx 接口 */
  wxp,

  /** 对请求的封装，内部处理取对应环境的 baseURL */
  async request(options) {
    const { baseURL } = this.config
    let opt = {}
    if (typeof options === 'string') {
      opt = {
        url: options,
        baseURL,
        method: 'GET',
      }
    } else {
      opt = options
      opt.baseURL = baseURL
    }

    const response = await requestWrap(opt)

    if (response.status === 200) {
      // 除特定情况外，一律响应 200 状态码
      return response
    } else if (response.status === 401) {
      // 需要鉴权的接口无法获取 userId，则响应 401 状态码，小程序端先登录一遍后再次发起请求
      await this.login()
      return await requestWrap(opt)
    } else {
      // TO DO
    }
  },

  /** 登录接口，获取 token 并存储 */
  async login() {
    /** 最近一次登录时间（毫秒数） */
    const lastLoginTime = wx.getStorageSync('last_login')

    if (lastLoginTime) {
      /** 当前时间（毫秒数） */
      const now = new Date().getTime()

      /** 保留登录时间 60s，期间内不再发起请求而返回已有的 token */
      const TIME_DIFF = 60 * 1000

      if (now - lastLoginTime < TIME_DIFF) {
        return wx.getStorageSync('token')
      }
    }

    const { baseURL } = this.config
    const { code } = await wxp.login()

    return requestWrap({
      baseURL,
      url: '/login',
      params: {
        code,
      },
      method: 'GET',
    }).then((res) => {
      const { token } = res.data
      if (token) {
        wx.setStorageSync('token', token)
        wx.setStorageSync('last_login', new Date().getTime())
        return token
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
        })
      }
    })
  },

  get(options) {
    return this.request(options)
  },

  post(options) {
    if (typeof options !== 'object') {
      throw new Error('POST 请求的参数应该是一个对象')
    }
    options.method = 'POST'
    return this.request(options)
  },
})
