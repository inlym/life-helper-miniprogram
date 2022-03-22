// pages/test/test.ts
import { logger } from '../../app/core/logger'
import { login } from '../../app/core/auth'

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
  onLoad() {
    logger.debug('测试页启动 ...')
    login().then(console.log)
  },
})
