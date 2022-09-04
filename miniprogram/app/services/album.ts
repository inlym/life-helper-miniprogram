import {requestForData} from '../core/http'

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
  total: number
}

/** 创建或修改接口需要的相册数据 */
export interface ModifyingAlbum {
  /** 相册名称 */
  name: string

  /** 相册描述 */
  description: string
}

/** 获取相册列表接口响应数据 */
export interface AlbumListResponse {
  list: Album[]
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
export function createAlbum(album: ModifyingAlbum): Promise<Album> {
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
export function updateAlbum(id: string, album: ModifyingAlbum): Promise<Album> {
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
