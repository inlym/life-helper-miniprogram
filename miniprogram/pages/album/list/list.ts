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

    /** ============================== 页面状态数据 ============================== */

    /** 当前的排序模式 */
    mode: 'createTimeDesc',

    /** 是否展示操作按钮组件 */
    showActionSheet: false,

    /** 操作按钮组件数据 */
    actionSheet: {
      title: '请选择排序方式',
      actions: [
        {text: '创建时间（升序）', value: 'createTimeAsc'},
        {text: '创建时间（降序）', value: 'createTimeDesc'},
        {text: '更新时间（升序）', value: 'updateTimeAsc'},
        {text: '更新时间（降序）', value: 'updateTimeDesc'},
      ],
    },

    /** ============================== 其他 ============================== */

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

  /** 打开排序操作面板 */
  showOrderOptionsPanel() {
    this.setData({showActionSheet: true})
  },

  onActionTap(event: any) {
    const mode = event.detail.value
    this.setData({mode, showActionSheet: false})

    if (mode === 'createTimeAsc') {
      this.sortByCreateTimeAsc()
    } else if (mode === 'createTimeDesc') {
      this.sortByCreateTimeDesc()
    } else if (mode === 'updateTimeAsc') {
      this.sortByUpdateTimeAsc()
    } else if (mode === 'updateTimeDesc') {
      this.sortByUpdateTimeDesc()
    }
  },

  /** 按创建时间升序排列 */
  sortByCreateTimeAsc() {
    const list = this.data.list
    list.sort((a, b) => a.createTime - b.createTime)
    this.setData({list})
  },

  /** 按创建时间降序排列 */
  sortByCreateTimeDesc() {
    const list = this.data.list
    list.sort((a, b) => b.createTime - a.createTime)
    this.setData({list})
  },

  /** 按更新时间升序排列 */
  sortByUpdateTimeAsc() {
    const list = this.data.list
    list.sort((a, b) => a.updateTime - b.updateTime)
    this.setData({list})
  },

  /** 按更新时间降序排列 */
  sortByUpdateTimeDesc() {
    const list = this.data.list
    list.sort((a, b) => b.updateTime - a.updateTime)
    this.setData({list})
  },

  /** 跳转到创建相册页面 */
  goToAddPage() {
    wx.navigateTo({url: '/pages/album/add/add'})
  },
})
