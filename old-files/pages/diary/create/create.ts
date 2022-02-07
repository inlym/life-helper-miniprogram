import { sharedInit } from '../../../app/core/shared-init'
import { TapEvent } from '../../../app/core/wx.interface'
import { addDiary } from '../../../app/services/diary.service'
import { UploadSuccessResult, uploadToOss } from '../../../app/services/upload.service'

interface MediaFile {
  type?: 'image' | 'video' | 'add' | 'delete' | 'done'
  size?: number
  tempFilePath?: string
  thumbTempFilePath?: string
  width?: number
  height?: number
  duration?: number

  /** 是否已经上传 */
  hasUploaded?: boolean

  /** 上传 OSS 的路径 */
  path?: string
}

/** textarea 输入变化事件 */
export interface InputChangeEvent {
  detail: {
    value: string
  }
}

Page({
  data: {
    /** 内容文本 */
    content: '',

    /** 视频列表 */
    videos: [] as MediaFile[],

    /** 照片列表 */
    images: [] as MediaFile[],

    /** 定位数据 */
    location: {},

    /** 是否定位 */
    hasLocated: false,

    /** 完整列表 */
    list: [] as MediaFile[],

    /** 是否开启删除模式 */
    deleteMode: false,
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    this.reComputeList()

    await sharedInit(eventName)
  },

  onLoad() {
    this.init('onLoad')
  },

  /**
   * 监听多行输入框输入，改变对应的 `content` 字段值
   */
  onTextChange(event: InputChangeEvent) {
    this.setData({
      content: event.detail.value,
    })
  },

  /**
   * 新增视频或图片
   */
  add() {
    wx.chooseMedia({
      maxDuration: 60,
      sizeType: ['original'],
    }).then((res) => {
      console.log(res)
      const type = res.type as 'image' | 'video'
      if (type === 'image') {
        const list = this.data.images.concat(res.tempFiles)
        this.setData({ images: list })
      } else if (type === 'video') {
        const list = this.data.videos.concat(res.tempFiles)
        this.setData({ videos: list })
      }

      this.upload()
      this.reComputeList()
    })
  },

  /**
   * 上传视频或图片至 OSS
   *
   * @description
   * 1. 该方法幂等，可无限制调用
   */
  upload() {
    const videos = this.data.videos
    const images = this.data.images

    videos.forEach((item: MediaFile) => {
      if (!item.hasUploaded) {
        uploadToOss('video', item.tempFilePath!).then((res: UploadSuccessResult) => {
          item.hasUploaded = true
          item.path = res.key

          this.setData({ videos })
          this.reComputeList()
        })
      }
    })

    images.forEach((item: MediaFile) => {
      if (!item.hasUploaded) {
        uploadToOss('image', item.tempFilePath!).then((res: UploadSuccessResult) => {
          item.hasUploaded = true
          item.path = res.key

          this.setData({ images })
          this.reComputeList()
        })
      }
    })
  },

  /**
   * 重新计算完整列表数据
   *
   * @description
   * 1. 该方法幂等，可无限制调用
   * 2. 每一次对视频或图片列表改动后执行该方法
   */
  reComputeList() {
    const videos = this.data.videos.map((item: MediaFile) => {
      item.type = 'video'
      return item
    })

    const images = this.data.images.map((item: MediaFile) => {
      item.type = 'image'
      return item
    })
    const list: Array<MediaFile> = videos.concat(images)

    if (!this.data.deleteMode) {
      if (list.length < 11) {
        list.push({ type: 'add' })
      }
      if (list.length > 1) {
        list.push({ type: 'delete' })
      }
    }

    if (this.data.deleteMode) {
      list.push({ type: 'done' })
    }

    this.setData({ list })
  },

  /**
   * 处理点击图片或视频事件
   *
   * @description
   * 1. 主要需要鉴别是否是删除模式
   */
  handleItemTap(event: TapEvent<{ tempPath: string }>) {
    const tempPath = event.currentTarget.dataset.tempPath
    if (this.data.deleteMode) {
      this.delete(tempPath)
    } else {
      this.preview(tempPath)
    }
  },

  /**
   * 预览图片和视频
   */
  preview(tempPath: string) {
    const list = this.data.videos.concat(this.data.images)

    const sources = list.map((item: MediaFile) => {
      const url = item.tempFilePath!
      const type = item.type! as 'video' | 'image'
      const poster = item.thumbTempFilePath!

      return { url, type, poster }
    })

    const current = sources.findIndex((item) => item.url === tempPath)

    wx.previewMedia({ sources, current, showmenu: true })
  },

  /**
   * 删除图片或视频
   */
  async delete(tempPath: string) {
    const result = await wx.showModal({
      title: '提示',
      content: '是否删除？',
      confirmText: '删除',
      confirmColor: '#fa5151',
    })

    if (result.confirm) {
      const videoIndex = this.data.videos.findIndex((item: MediaFile) => item.tempFilePath === tempPath)
      if (videoIndex >= 0) {
        const newVideos = this.data.videos.slice(0, videoIndex).concat(this.data.videos.slice(videoIndex + 1))
        this.setData({ videos: newVideos })
      }

      const imageIndex = this.data.images.findIndex((item: MediaFile) => item.tempFilePath === tempPath)
      if (imageIndex >= 0) {
        const newImages = this.data.images.slice(0, imageIndex).concat(this.data.images.slice(imageIndex + 1))
        this.setData({ images: newImages })
      }

      this.reComputeList()
    }
  },

  /**
   * 开启删除模式
   */
  enableDeleteMode() {
    this.setData({
      deleteMode: true,
    })

    this.reComputeList()
  },

  /**
   * 关闭删除模式
   */
  disableDeleteMode() {
    this.setData({
      deleteMode: false,
    })

    this.reComputeList()
  },

  /** 能否提交 */
  canSubmit(): boolean {
    if (this.data.content && this.data.videos.length === 0 && this.data.images.length === 0) {
      return false
    }
    return true
  },

  /**
   * 点击“发表”按钮
   */
  async submit() {
    const content = this.data.content
    const images = this.data.images.map((item: MediaFile) => item.path!)
    const videos = this.data.videos.map((item: MediaFile) => item.path!)
    const location = this.data.hasLocated ? this.data.location : undefined

    const data = { content, images, videos, location }

    await addDiary(data)

    wx.showToast({
      title: '发表成功',
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  },
})
