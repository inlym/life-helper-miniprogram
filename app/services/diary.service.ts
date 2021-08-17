import { request } from '../core/request'

/** 视频或图片资源 */
export interface Media {
  /** 类型 */
  type: 'image' | 'video'

  /** 路径，即 `video/xxx` 或 `image/xxx` 格式的字符串 */
  path: string

  /** 完整的资源 URL 地址 */
  url: string

  /** 视频封面图 */
  coverUrl?: string
}

export interface Diary {
  /** 内容文本 */
  content: string

  /** 照片列表 */
  images: string[]

  /** 视频列表 */
  videos: string[]

  medias?: Media[]
}

export interface AddDiaryResponse {
  id: number
}

/**
 * 新增一条生活记录
 *
 * @param data
 */
export async function addDiary(data: Diary): Promise<number> {
  const response = await request<AddDiaryResponse>({
    method: 'POST',
    url: '/diary',
    data,
  })

  return response.data.id
}

/** ───────────────────────────────  查看列表  ─────────────────────────────── */

export interface GetDiaryListResponse {
  list: Diary[]
}

export async function getDiaryList(): Promise<Diary[]> {
  const response = await request<GetDiaryListResponse>({
    method: 'GET',
    url: '/diary',
  })

  return response.data.list
}
