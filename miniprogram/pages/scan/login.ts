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

  /** 进行“扫码”操作 */
  scan() {
    const id = this.data.id
    scanQrCode(id).then(this.handleOperatorResult)
  },

  /** 进行“确认登录”操作 */
  confirm() {
    const id = this.data.id
    this.setData({confirmLoading: true})
    confirmQrCode(id).then(this.handleOperatorResult)
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
      this.setData({confirmLoading: false})

      wx.showToast({
        title: '登录成功',
        icon: 'success',
        mask: true,
      })

      setTimeout(() => {
        this.goToIndex()
      }, 1500)
    } else if (result.status === ScanLoginStatus.INVALID) {
      wx.showToast({
        title: '该二维码已失效，请重新扫码！',
        icon: 'none',
      })

      setTimeout(() => {
        this.goToIndex()
      }, 1500)
    } else {
      throw new Error('未知的状态！')
    }
  },
})
