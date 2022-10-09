// pages/album/edit/edit.ts
// 页面名称：相册编辑页
// 主要用途：对相册进行“新增”、“编辑”操作时，用于填写相册的名称和描述等信息。

// 主要逻辑（1）：操作类型为新增还是删除
// 根据页面路径参数，如果带有有效的 `album_id` 参数，则为编辑该相册，否则为新增。

import {createAlbum, updateAlbum} from '../../../app/services/album'
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

/** 新增相册情况的几处文案 */
const AddTypeText = {
  /** 输入框的默认文案 */
  text1: '请输入相册名称',
  /** 底部操作按钮文案 */
  text2: '新建相册',
}

const EditTypeText = {
  /** 输入框的默认文案 */
  text1: '请输入相册名称',
  /** 底部操作按钮文案 */
  text2: '确定修改',
}

Page({
  data: {
    // =============================== 页面初始化数据 ================================

    /** 操作类型：新增（默认）、编辑 */
    type: 'add' as OperateType,

    /** 相册 ID，从页面路径参数中获取，可能为空 */
    albumId: '',

    /** 文本集合 */
    textWrapper: AddTypeText,

    /** 相册名称 */
    albumName: '',

    // ================================ 表单数据 ==================================

    /** 表单校验规则 */
    formRules: [
      {
        name: 'albumName',
        rules: [
          {required: true, message: '请填写相册名称'},
          {maxlength: 10, message: '相册名称最长10个字哦'},
        ],
      },
    ],

    /** 表单数据 */
    formData: {
      albumName: '',
    },

    // =============================== 页面状态数据 =================================

    /** 顶部错误提示组件文案 */
    error: '',
  },

  behaviors: [themeBehavior],

  onLoad(query: PageQuery) {
    if (query.album_id) {
      // 页面路径包含 `album_id` 参数表示当前“编辑”相册情况

      this.setData({
        type: 'edit',
        albumId: query.album_id,
        textWrapper: EditTypeText,
      })

      wx.setNavigationBarTitle({title: '编辑相册'})

      // -- 备注（2022.09.20） --
      // 目前设定：“编辑相册”情况不会从外链直接跳入，而是从相册详情页跳转进入，因此待编辑的相册数据由上个页面通过事件通道传
      // 递，不需要发起 HTTP 请求获取。若该设定发生变化，后续需要调整为通过 `albumId` 参数发情 HTTP 请求获取待编辑的相册信息。
      const eventChannel = this.getOpenerEventChannel()
      if (typeof eventChannel.on === 'function') {
        eventChannel.on(TRANSFER_VALUE_EVENT, (data: PageTransferedValue) => {
          this.setData({
            albumName: data.name,
          })
        })
      }
    } else {
      // 页面路径不包含 `album_id` 参数表示当前“新增”相册情况
      // 目前设定只有“新增”和“编辑”两种情况，因此这些逻辑就直接写在 `else` 分支中了

      this.setData({type: 'add', textWrapper: AddTypeText})
      wx.setNavigationBarTitle({title: '创建相册'})
    }
  },

  /** 处理输入框输入变化事件 */
  onAlbumNameInputChange(e: any) {
    this.setData({[`formData.albumName`]: e.detail.value})
  },

  /** 处理点击“提交”按钮事件 */
  onSubmitTap() {
    // 表单校验
    this.selectComponent('#form').validate((isValid: boolean, errors: any[]) => {
      if (!isValid) {
        this.setData({error: errors[0].message})
      } else {
        const albumName = this.data.formData.albumName

        if (this.data.type === 'add') {
          createAlbum({name: albumName})
          wx.showToast({
            title: '创建成功',
            icon: 'success',
          })
        } else if (this.data.type === 'edit') {
          const id = this.data.albumId
          updateAlbum(id, {name: albumName})
          wx.showToast({
            title: '修改成功',
            icon: 'success',
          })
        }

        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    })
  },
})
