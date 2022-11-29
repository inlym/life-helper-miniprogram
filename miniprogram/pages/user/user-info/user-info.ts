import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/user/user-info/user-info.ts
Page({
  data: {
    // ---------------------------- 从 HTTP 请求获取的数据 ----------------------------
    // -------------------------------- 页面状态数据 ---------------------------------
    // -------------------------------- 其他页面数据 ---------------------------------
  },

  behaviors: [themeBehavior],

  /** 初始化方法 */
  init() {
    // todo
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    this.init()
  },
})
