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
