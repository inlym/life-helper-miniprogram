// pages/album/detail/detail.ts
// 相册详情页

import {Album, deleteMedia, getAlbumDetail, uploadMediaFile} from '../../../app/services/album'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// 注意事项（1）
// 相册 ID 必须在页面路径中传参，因为该页面可能直接从外部链接进入。

/** 页面路径参数 */
export interface QueryParams {
  /** 相册 ID */
  id: string
}

Page({
  data: {
    /** 相册 ID，从页面路径参数获取 */
    albumId: '',

    /** 相册详情 */
    albumDetail: {} as Album,

    sizeMB: 0,

    // ======================= 页面状态 =======================

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
})
