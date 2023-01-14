import {confirmQrcode, scanQrcode} from '../../app/services/scan-login'
import {themeBehavior} from '../../behaviors/theme-behavior'

/** 扫码操作状态 */
export type ScanStatus = 'initial' | 'scanned' | 'succeeded' | 'failed'

// pages/scan/login.ts
Page({
  /** 页面的初始数据 */
  data: {
    /** 扫码登录凭据 ID */
    id: '',

    /** IP 地址 */
    ip: '',

    /** IP 地址所在区域，包含省和市，例如：浙江杭州 */
    region: '',

    /** ====================== 页面状态 ====================== */

    /** “确认登录”按钮是否显示 Loading */
    confirmLoading: false,

    status: 'initial' as ScanStatus,

    /** 错误消息 */
    errorMsg: '',

    /** ==================== 静态资源地址 ==================== */

    /** 电脑图案的图片的 URL 地址 */
    pcImageUrl: 'https://static.lifehelper.com.cn/images/pc.png',
  },

  behaviors: [themeBehavior],

  async onLoad(query) {
    // 从小程序码中获取「扫码登录凭据」的 ID
    const id = query.scene
    this.setData({id})

    wx.showLoading({title: '加载中'})
    await this.scan()
    wx.hideLoading()
  },

  /** 进行【扫码】操作，用于获取凭据的基本信息 */
  async scan() {
    const id = this.data.id

    const result = await scanQrcode(id)
    if (result.errorCode) {
      this.setData({
        status: 'failed',
        errorMsg: result.errorMessage,
      })
    } else {
      this.setData({
        ip: result.ip,
        region: result.region,
        status: 'scanned',
      })
    }
  },

  /** 进行“确认登录”操作 */
  async confirm() {
    const id = this.data.id
    this.setData({confirmLoading: true})
    const result = await confirmQrcode(id)
    if (result.errorCode) {
      this.setData({
        status: 'failed',
        errorMsg: result.errorMessage,
      })
    } else {
      this.setData({
        status: 'succeeded',
        confirmLoading: false,
      })
    }
  },

  /** 跳转到首页 */
  goToIndex() {
    // 实际上可以直接跳转首页的，但是为了让用户知道发生了什么，加了这个等待提示
    wx.showToast({
      title: '正在跳转首页',
      icon: 'loading',
      mask: true,
      duration: 2000,
    })

    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 1500)
  },

  /** 点击“取消登录”按钮 */
  cancel() {
    wx.showToast({
      title: '已取消登录',
      icon: 'none',
      duration: 2000,
      mask: true,
    }).then(() => {
      setTimeout(() => {
        this.goToIndex()
      }, 1000)
    })
  },
})
