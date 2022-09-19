// pages/album/edit/edit.ts
// 页面名称：相册编辑页
// 主要用途：对相册进行“新增”、“编辑”操作时，用于填写相册的名称和描述等信息。

// 主要逻辑（1）：操作类型为新增还是删除
// 根据页面路径参数，如果带有有效的 `album_id` 参数，则为编辑该相册，否则为新增。

import {themeBehavior} from '../../../behaviors/theme-behavior'

/** 操作类型：新增、编辑 */
export type OperateType = 'add' | 'edit'

/** 页面路径参数 */
export interface PageQuery {
  /** 相册 ID */
  album_id?: string
}

/** 页面传值事件 */
export const TRANSFER_VALUE_EVENT = 'TRANSFER_VALUE_EVENT'

/** 页面传值数据 */
export interface PageTransferedValue {
  /** 相册名称 */
  name: string
  /** 相册描述 */
  description: string
}

Page({
  data: {
    // =============================== 页面初始化数据 ================================

    /** 操作类型：新增（默认）、编辑 */
    type: 'add' as OperateType,

    /** 相册 ID，从页面路径参数中获取，可能为空 */
    albumId: '',

    // ================================ 表单数据 ==================================

    /** 相册名称 */
    albumName: '',

    /** 相册描述 */
    albumDesc: '',
  },

  behaviors: [themeBehavior],

  onLoad(query: PageQuery) {
    if (query.album_id) {
      // 页面路径包含 `album_id` 参数表示当前“编辑”相册情况

      this.setData({
        type: 'edit',
        albumId: query.album_id,
      })

      wx.setNavigationBarTitle({title: '编辑相册'})

      // （2022.09.20）目前设定：“编辑相册”情况不会从外链直接跳入，而是从相册详情页跳转进入，因此待编辑的相册数据由上个页面通过事件通道传
      // 递，不需要发起 HTTP 请求获取。若该设定发生变化，后续需要调整为通过 `albumId` 参数发情 HTTP 请求获取待编辑的相册信息。
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on(TRANSFER_VALUE_EVENT, (data: PageTransferedValue) => {
        this.setData({
          albumName: data.name,
          albumDesc: data.description,
        })
      })
    } else {
      // 页面路径不包含 `album_id` 参数表示当前“新增”相册情况
      // 目前设定只有“新增”和“编辑”两种情况，因此这些逻辑就直接写在 `else` 分支中了

      wx.setNavigationBarTitle({title: '新增相册'})
    }
  },
})
