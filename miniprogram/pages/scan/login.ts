import {confirmQrcode, scanQrcode} from '../../app/services/scan-login'

// pages/scan/login.ts
Page({
  /** 页面的初始数据 */
  data: {
    /** 登录凭证编号 */
    ticket: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(query.scene)
    this.setData({ticket: scene})
  },

  scan() {
    const ticket = this.data.ticket
    scanQrcode(ticket).then(console.log)
  },

  confirm() {
    const ticket = this.data.ticket
    confirmQrcode(ticket).then(console.log)
  },
})
