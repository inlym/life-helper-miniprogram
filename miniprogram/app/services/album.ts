import {requestForData} from '../core/http'
import {getOssPostCredential, uploadToOss} from './oss'

/** 相册 */
export interface Album {
  /** 相册 ID */
  id: string

  /** 相册名称 */
  name: string

  /** 相册描述 */
  description: string

  /** 创建时间 */
  createTime: number

  /** 更新时间 */
  updateTime: number

  /** 资源（照片和视频）数量 */
  count: number

  /** 相册文件总大小（单位：B） */
  size: number

  /** 相册封面图地址 */
  coverImageUrl: string

  /** 媒体文件列表，仅查看相册详情时返回 */
  medias: Media[]

  /** 图片总数 */
  imageCount: number

  /** 视频总数 */
  videoCount: number
}

/** 媒体文件（照片和视频） */
export interface Media {
  /** 媒体文件 ID */
  id: string

  /**
   * 类型
   *
   * 1. `image` => 图片
   * 2. `video` => 视频
   */
  type: string

  /** 文件地址 */
  url: string

  /** 上传时间 */
  uploadTime: number

  /** 视频缩略图地址 */
  thumbUrl: string
}

/** 创建或修改接口需要的相册数据 */
export interface ModifyAlbumData {
  /** 相册名称 */
  name: string
}

/** 获取相册列表接口响应数据 */
export interface AlbumListResponse {
  list: Album[]

  /** 所有相册的资源数量之和 */
  totalCount: number

  /** 所有资源的文件大小之和（单位：B） */
  totalSize: number
}

/** 删除相册接口响应数据 */
export interface DeleteAlbumResponse {
  /** 相册 ID */
  id: string
}

/**
 * 获取相册列表
 */
export function getAlbumList(): Promise<AlbumListResponse> {
  return requestForData({
    method: 'GET',
    url: '/albums',
    auth: true,
  })
}

/**
 * 创建一个相册
 */
export function createAlbum(album: ModifyAlbumData): Promise<Album> {
  return requestForData({
    method: 'POST',
    url: '/album',
    auth: true,
    data: album,
  })
}

/**
 * 修改相册信息
 */
export function updateAlbum(id: string, album: ModifyAlbumData): Promise<Album> {
  return requestForData({
    method: 'PUT',
    url: `/album/${id}`,
    auth: true,
    data: album,
  })
}

/**
 * 删除一个相册
 */
export function deleteAlbum(id: string): Promise<DeleteAlbumResponse> {
  return requestForData({
    method: 'DELETE',
    url: `/album/${id}`,
    auth: true,
  })
}

/**
 * 获取包含媒体文件列表的相册详情
 *
 * @param id 相册 ID
 */
export function getAlbumDetail(id: string): Promise<Album> {
  return requestForData({
    method: 'GET',
    url: `/album/${id}`,
    auth: true,
  })
}

/**
 * 删除媒体资源
 *
 * @param albumId 相册 ID
 * @param mediaId 媒体资源 ID
 */
export function deleteMedia(albumId: string, mediaId: string) {
  return requestForData({
    method: 'DELETE',
    url: `/album/${albumId}/media/${mediaId}`,
    auth: true,
  })
}

/**
 * 上传媒体文件至 OSS
 *
 * @param albumId 相册 ID
 * @param media 从微信选取的媒体文件
 * @param onProgressUpdate 进度变化回调函数
 */
export async function uploadMediaFile(
  albumId: string,
  media: WechatMiniprogram.MediaFile,
  onProgressUpdate: WechatMiniprogram.UploadTaskOnProgressUpdateCallback
): Promise<void> {
  if (media.fileType === 'image') {
    const credential = await getOssPostCredential('image')

    uploadToOss(media.tempFilePath, credential).onProgressUpdate((res) => {
      if (res.progress === 100) {
        requestForData({
          method: 'POST',
          url: `/album/${albumId}/media`,
          params: {type: 'image'},
          auth: true,
          data: {
            path: credential.key,
            size: media.size,
            uploadTime: Date.now(),
          },
        })
      }

      onProgressUpdate(res)
    })
  } else if (media.fileType === 'video') {
    const [c1, c2] = await Promise.all([getOssPostCredential('image'), getOssPostCredential('video')])

    // 上传封面图
    uploadToOss(media.thumbTempFilePath, c1)

    // 备注（2022.09.07）
    // 这里假定了上传封面图一定会成功，临时先这么处理了。

    // 上传视频
    uploadToOss(media.tempFilePath, c2).onProgressUpdate((res) => {
      if (res.progress === 100) {
        requestForData({
          method: 'POST',
          url: `/album/${albumId}/media`,
          params: {type: 'video'},
          auth: true,
          data: {
            path: c2.key,
            size: media.size,
            uploadTime: Date.now(),
            width: media.width,
            height: media.height,
            thumbPath: c1.key,
            duration: media.duration,
          },
        })
      }

      onProgressUpdate(res)
    })
  } else {
    throw new Error('未支持的媒体类型！')
  }
}
