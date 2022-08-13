import {requestForData} from '../core/http'
import {Album, AlbumListResponse, DeleteAlbumResponse, ModifyingAlbum} from './album.interface'

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
    url: '/albums',
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
    url: `/albums/${id}`,
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
    url: `/albums/${id}`,
    auth: true,
  })
}
