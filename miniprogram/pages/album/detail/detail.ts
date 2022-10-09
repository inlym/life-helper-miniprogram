// pages/album/detail/detail.ts
// 相册详情页

import {Album, deleteMedia, getAlbumDetail, uploadMediaFile, deleteAlbum} from '../../../app/services/album'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// 注意事项（1）
// 相册 ID 必须在页面路径中传参，因为该页面可能直接从外部链接进入。

/** 页面路径参数 */
export interface QueryParams {
  /** 相册 ID */
  id: string
}

/** 页面传值事件 */
const TRANSFER_VALUE_EVENT = 'TRANSFER_VALUE_EVENT'

Page({
  data: {
    // ================================ 页面传参数据 ================================

    /** 相册 ID，从页面路径参数获取 */
    albumId: '',

    // ============================= HTTP 请求获取的数据 =============================

    /** 相册详情 */
    albumDetail: {} as Album,

    // ====================== HTTP 请求获取的数据二次计算后的数据 =======================

    /** 相册占用空间 */
    sizeMB: 0,

    // ================================ 页面状态数据 ================================

    /** 当前正要操作的媒体资源索引值 */
    currentIndex: 0,

    // ================= ActionSheet 组件数据 =================

    /** 是否展示底部操作按钮组件 */
    showActionSheet: false,

    actionSheetActions: [
      {text: '预览', value: 'preview'},
      {text: '删除', type: 'warn', value: 'delete'},
    ],
  },

  behaviors: [themeBehavior],

  /**
   * ## 页面说明
   * 进入页面必须携带参数 `id` - 相册 ID
   */
  onLoad(query: Record<string, string>) {
    const albumId = (query as unknown as QueryParams).id
    this.setData({albumId})

    this.init()
  },

  /** 页面初始化 */
  async init() {
    const albumId = this.data.albumId
    const album = await getAlbumDetail(albumId)
    const sizeMB = Math.ceil(album.size / (1024 * 1024))
    this.setData({albumDetail: album, sizeMB})

    wx.setNavigationBarTitle({title: album.name})
  },

  /** 选择并上传照片（视频） */
  async chooseAndUpload() {
    const albumId = this.data.albumId

    const result = await wx.chooseMedia({
      maxDuration: 60,
    })

    result.tempFiles.forEach((item) => {
      uploadMediaFile(albumId, item, () => {
        // ...
      })
    })
  },

  /** 处理媒体文件点击事件 */
  onMediaItemTap(e: any) {
    const index = e.currentTarget.dataset.index

    this.setData({
      currentIndex: index,
      showActionSheet: true,
    })
  },

  /** 处理 ActionSheet 组件点击事件 */
  async onActionTap(e: any) {
    const operator = e.detail.value as 'preview' | 'delete'
    const index = this.data.currentIndex
    const albumId = this.data.albumId

    this.setData({showActionSheet: false})

    if (operator === 'preview') {
      const list = this.getPreviewList()
      wx.previewMedia({
        sources: list,
        current: index,
      })
    } else if (operator === 'delete') {
      const result = await wx.showModal({
        title: '提示',
        content: '是否确认删除？',
        confirmText: '确认删除',
        confirmColor: '#fa5151',
      })

      if (result.confirm) {
        // 删除资源
        const albumDetail = this.data.albumDetail
        const medias = albumDetail.medias
        const mediaId = medias[index].id
        medias.splice(index, 1)
        albumDetail.medias = medias
        this.setData({albumDetail})
        deleteMedia(albumId, mediaId)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        })
      }
    }
  },

  /** 获取预览列表 */
  getPreviewList(): WechatMiniprogram.MediaSource[] {
    return this.data.albumDetail.medias.map((item) => {
      return {
        url: item.url,
        type: item.type as 'image' | 'video',
        poster: item.type === 'video' ? item.thumbUrl : undefined,
      }
    })
  },

  /** 处理“编辑”按钮点击事件 */
  onEditButtonTap() {
    const albumId = this.data.albumId
    const albumName = this.data.albumDetail.name

    wx.navigateTo({
      url: `/pages/album/edit/edit?album_id=${albumId}`,
      success(res) {
        res.eventChannel.emit(TRANSFER_VALUE_EVENT, {name: albumName})
      },
    })
  },

  /** 操作删除相册 */
  async deleteAlbum() {
    // 相册中资源不为空时则不允许删除
    if (this.data.albumDetail.medias?.length > 0) {
      wx.showModal({
        title: '提示',
        content: '当前相册不为空，无法删除！若需删除，请先清空相册内的照片和视频。',
        showCancel: false,
        confirmText: '我知道了',
      })
    } else {
      const albumName = this.data.albumDetail.name

      const result = await wx.showModal({
        title: '提示',
        content: `是否删除相册 ${albumName} ？`,
        showCancel: true,
        confirmText: '确认删除',
        confirmColor: '#fa5151',
        cancelText: '暂不删除',
      })

      if (result.confirm) {
        const albumId = this.data.albumId
        deleteAlbum(albumId)

        wx.showToast({
          title: '删除成功',
          icon: 'success',
        })

        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    }
  },
})
