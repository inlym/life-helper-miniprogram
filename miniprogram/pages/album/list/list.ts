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

    /** 所有相册的资源数量之和 */
    totalCount: 0,

    /** 所有资源的文件大小之和 */
    totalSizeMB: 0,

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
  },

  behaviors: [themeBehavior, shareAppBehavior],

  // 从“新增页”返回时，页面数据也需要刷新，因此把初始化放在这个生命周期
  onShow() {
    this.init()
  },

  /** 页面初始化 */
  init() {
    this.getAlbumList()
  },

  /** 获取相册列表数据并赋值 */
  async getAlbumList() {
    const {list, totalCount, totalSize} = await getAlbumList()
    const totalSizeMB = Math.ceil(totalSize / (1024 * 1024))
    this.setData({list, totalCount, totalSizeMB})
    this.reorderList()
  },

  /** 打开排序操作面板 */
  showOrderOptionsPanel() {
    this.setData({showActionSheet: true})
  },

  onActionTap(event: any) {
    const mode = event.detail.value
    this.setData({mode, showActionSheet: false})

    this.reorderList()
  },

  /** 将相册列表数据重排序 */
  reorderList() {
    const mode = this.data.mode

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

  /** 处理相册列表项目点击事件 */
  onAlbumItemTap(e: any) {
    const albumId = e.currentTarget.dataset.id
    const url = `/pages/album/detail/detail?id=${albumId}`
    wx.navigateTo({url})
  },
})
