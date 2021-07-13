'use strict'

const { CustomPage } = getApp()
const { confirmCheckCode } = require('../../../app/services/login')

CustomPage({
  data: {
    /** 是否已登录 */
    hasLogined: false,
  },

  computed: {},

  requested: {},

  onLoad() {
    this.logger.debug(`CheckCode => \`${this.query('scene')}\``)
  },

  /**
   * 确认登录
   */
  async confirm() {
    const code = this.query('scene')
    await confirmCheckCode(code)
    this.setData({ hasLogined: true })
  },

  /**
   * 返回首页
   */
  backToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },
})
