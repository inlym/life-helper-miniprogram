// pages/user/register-time/register-time.ts
import {getUserInfo} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 注册时间 */
    registerTime: '',
  },

  behaviors: [themeBehavior],

  /** 页面初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({registerTime: userInfo.registerTime})
  },

  onLoad() {
    this.init()
  },
})
