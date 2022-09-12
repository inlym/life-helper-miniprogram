// pages/album/detail/detail.ts
// 相册详情页

import {Album, getAlbumDetail, uploadMediaFile} from '../../../app/services/album'
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
    this.setData({albumDetail: album})

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
})
