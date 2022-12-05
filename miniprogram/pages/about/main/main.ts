// pages/about/main/main.ts

import {StaticUrl} from '../../../app/core/constant'
import {getVersion} from '../../../app/core/system'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 当前的版本号 */
    version: '',

    /** logo 图片的 URL 地址 */
    logoUrl: '',
  },

  behaviors: [themeBehavior],

  /** 页面初始化方法 */
  async init() {
    const version = getVersion()
    const logoUrl = StaticUrl.LOGO
    this.setData({version, logoUrl})
  },

  onLoad() {
    this.init()
  },
})
