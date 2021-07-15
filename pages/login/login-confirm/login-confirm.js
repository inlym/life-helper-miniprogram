'use strict'

const { CustomPage } = getApp()
const { scanQrcode, confirmQrcode } = require('../../../app/services/login')

CustomPage({
  data: {
    /** 是否已登录 */
    hasLogined: false,

    /** 按钮是否带 loading 图标 */
    loading: false,
  },

  onLoad() {
    this.logger.debug(`code => \`${this.query('scene')}\``)
    this.scan()
  },

  scan() {
    const code = this.query('scene')
    scanQrcode(code)
  },

  /**
   * 确认登录
   */
  async confirm() {
    const code = this.query('scene')
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
