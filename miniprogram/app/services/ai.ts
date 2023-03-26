import {BaseResponse} from './../http/types'
import {requestForData} from '../core/http'

export interface CreateCompletionResponse extends BaseResponse {
  /** 回复的内容 */
  text: string
}

export function createCompletion(prompt: string): Promise<CreateCompletionResponse> {
  return requestForData({
    method: 'POST',
    url: '/ai/text',
    auth: false,
    data: {prompt},
  })
}
