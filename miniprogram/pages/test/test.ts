// pages/test/test.ts
import { ensureLogined } from '../../app/core/auth'
import { getUserInfo } from '../../app/services/userinfo'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: 'mark',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    await ensureLogined()
    await this.init()
  },

  async init() {
    const data = await getUserInfo()
    console.log(data)
  },
})
