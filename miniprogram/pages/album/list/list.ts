// pages/album/list/list.ts
// 相册模块主页：相册列表页

import {getAlbumList} from '../../../app/services/album'
import {shareAppBehavior} from '../../../behaviors/share-app-behavior'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    albumList: [1, 2, 3, 4],
  },

  behaviors: [themeBehavior, shareAppBehavior],

  /** 页面初始化 */
  init() {
    getAlbumList().then(console.log)
  },

  onLoad() {
    this.init()
  },
})
