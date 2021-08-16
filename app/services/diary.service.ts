import { request } from '../core/request'

export interface AddDiaryData {
  /** 内容文本 */
  content: string

  /** 照片列表 */
  images: string[]

  /** 视频列表 */
  videos: string[]

  /** 位置信息 */
  location: any
}

export interface AddDiaryResponse {
  id: number
}

/**
 * 新增一条生活记录
 *
 * @param data
 */
export async function addDiary(data: AddDiaryData): Promise<number> {
  const response = await request<AddDiaryResponse>({
    method: 'POST',
    url: '/diary',
    data,
  })

  return response.data.id
}
