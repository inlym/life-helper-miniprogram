import {confirmQrCode, scanQrCode} from '../../app/services/scan-login'
import {ScanLoginResult, ScanLoginStatus} from '../../app/services/scan-login.interface'
import {themeBehavior} from '../../behaviors/theme-behavior'

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

    /** ==================== 页面元素状态 ==================== */

    /** “确认登录”按钮是否显示 Loading */
    confirmLoading: false,

    /** ==================== 静态资源地址 ==================== */

    /** 电脑图案的图片的 URL 地址 */
    pcImageUrl: 'https://static.lifehelper.com.cn/images/pc.png',
  },

  behaviors: [themeBehavior],

  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const id = query.scene
    this.setData({id})

    this.scan()
  },

  /** 进行“扫码”操作 */
  scan() {
    const id = this.data.id
    scanQrCode(id).then(this.handleOperatorResult)
  },

  /** 进行“确认登录”操作 */
  confirm() {
    const id = this.data.id
    confirmQrCode(id).then(this.handleOperatorResult)
  },

  /**
   * 根据状态处理扫码结果
   */
  handleOperatorResult(result: ScanLoginResult) {
    if (result.status === ScanLoginStatus.SCANNED) {
      this.setData({
        ip: result.ip,
        region: result.region,
      })
    } else if (result.status === ScanLoginStatus.CONFIRMED) {
      this.setData({
        confirmLoading: false,
      })

      wx.showToast({
        title: '登录成功',
        icon: 'success',
      })

      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (result.status === ScanLoginStatus.INVALID) {
      wx.showToast({
        title: '该二维码已失效，请重新扫码！',
        icon: 'none',
      })

      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      throw new Error('未知的状态！')
    }
  },
})
