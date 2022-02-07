import { sharedInit } from '../../../app/core/shared-init'
import { scanQrcode, confirmQrcode } from '../../../app/services/scan.service'
import { getUserInfo, updateUserInfo } from '../../../app/services/user-info.service'

export interface Query {
  scene?: string
}

Page({
  data: {
    /** 是否已登录 */
    hasLogined: false,

    /** 按钮是否带 loading 图标 */
    loading: false,

    /** 头像 URL */
    avatarUrl: '',

    /** 昵称 */
    nickName: '',

    /** 页面入参 */
    query: {
      scene: '',
    },
  },

  /** 监听页面加载 */
  onLoad(query: Query) {
    this.setData({ query: { scene: query.scene || '' } })

    this.init('onLoad')
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)

    if (this.data.query.scene) {
      this.scan()
    }

    // 获取头像和昵称
    const userInfo = await getUserInfo()
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
    })
  },

  /** 扫码操作 */
  scan() {
    const code = this.data.query.scene
    scanQrcode(code)
  },

  /** 点击“确认登录”按钮 */
  async handleConfirmButtonTap() {
    // 有头像信息才进入到下一步，否则先获取头像信息
    if (this.data.avatarUrl) {
      this.confirm()
    } else {
      const userInfo = await updateUserInfo()
      if (userInfo) {
        this.confirm()
      }
    }
  },

  /** 确认登录操作 */
  async confirm() {
    const code = this.data.query.scene
    this.setData({ loading: true })
    await confirmQrcode(code)
    this.setData({ hasLogined: true, loading: false })
  },

  /**
   * 返回首页
   */
  backToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },
})
