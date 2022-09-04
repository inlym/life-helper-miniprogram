// pages/album/list/list.ts
// 相册模块主页：相册列表页

import {Album, getAlbumList} from '../../../app/services/album'
import {shareAppBehavior} from '../../../behaviors/share-app-behavior'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 相册列表 */
    list: [] as Album[],

    // 临时测试数据
    coverImageUrl: 'https://res.lifehelper.com.cn/image/7a384bc69e12480081c7e34ebaaab34f',
  },

  behaviors: [themeBehavior, shareAppBehavior],

  onLoad() {
    this.init()
  },

  /** 页面初始化 */
  init() {
    this.getAlbumList()
  },

  /** 获取相册列表数据并赋值 */
  async getAlbumList() {
    const {list} = await getAlbumList()
    this.setData({list})
  },
})
