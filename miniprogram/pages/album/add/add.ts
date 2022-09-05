import {createAlbum, ModifyingAlbumData} from '../../../app/services/album'
import {shareAppBehavior} from '../../../behaviors/share-app-behavior'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/album/add/add.ts
Page({
  data: {
    /** 相册名称 */
    name: '',

    /** 相册描述 */
    description: '',

    /** =================== 页面状态数据 =================== */

    /** 展示名称错误提示 */
    showNameError: false,
  },

  behaviors: [themeBehavior, shareAppBehavior],

  /** 提交操作 */
  submit(event: any) {
    const albumData = event.detail.value as ModifyingAlbumData
    if (this.checkData(albumData)) {
      createAlbum(albumData).then(() => {
        wx.showToast({title: '相册已添加', icon: 'success'})
        wx.navigateBack()
      })
    }
  },

  /** 检测待提交的相册数据 */
  checkData(albumData: ModifyingAlbumData): boolean {
    if (!albumData.name) {
      this.setData({showNameError: true})
      return false
    }
    return true
  },
})
