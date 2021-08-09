import { scanQrcode, confirmQrcode } from '../../../app-new/services/scan.service'

export interface Query {
  scene: string
}

function isQuery(query: Query): query is Query {
  if (query.scene) {
    return true
  }
  return false
}

Page({
  data: {
    /** 是否已登录 */
    hasLogined: false,

    /** 按钮是否带 loading 图标 */
    loading: false,

    /** 页面入参 */
    query: {
      scene: '',
    },
  },

  onLoad(query: Query) {
    if (isQuery(query)) {
      this.setData({ query })
    }
  },

  scan() {
    const code = this.data.query.scene
    scanQrcode(code)
  },

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
