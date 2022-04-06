// pages/test/test.ts

import {createCanvasContext} from '../../app/utils/canvas'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: 'mark',
    status: 2,

    buttons: [
      { type: 'warn', text: '按钮' },
      { type: 'default', text: '按钮' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //
  },

  async onReady() {
    const ctx = await createCanvasContext('#my-canvas')
    ctx.moveTo(100, 100)
    ctx.quadraticCurveTo(200, 200, 300, 100)
    ctx.stroke()
    ctx.closePath()
    ctx.moveTo(300, 100)
    ctx.quadraticCurveTo(400, 200, 500, 100)
    ctx.stroke()
    ctx.closePath()

  },
})
