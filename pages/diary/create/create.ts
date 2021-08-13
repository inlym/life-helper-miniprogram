import { sharedInit } from '../../../app/core/shared-init'
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
   * 预览图片和视频
   * todo
   */
  preview() {
    const sources = this.data.list
      .filter((item: MediaFile) => item.type !== 'add')
      .map((item: MediaFile) => {
        const url = item.tempFilePath!
        const type = item.type! as 'video' | 'image'
        const poster = item.thumbTempFilePath!

        return { url, type, poster }
      })

    wx.previewMedia({ sources })
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

    wx.showToast({
      title: '已退出删除模式！',
      icon: 'none',
    })

    this.reComputeList()
  },

  /**
   * 点击“发表”按钮
   */
  submit() {
    const content = this.data.content
    const images = this.data.images.map((item: MediaFile) => item.path)
    const videos = this.data.videos.map((item: MediaFile) => item.path)
    const location = this.data.hasLocated ? this.data.location : undefined

    const data = { content, images, videos, location }

    console.log(data)
  },
})
