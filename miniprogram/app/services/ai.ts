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

/** 智能会话消息 */
export interface AiChatMessage {
  /** 消息 ID */
  id: string
  /** 角色 */
  role: string
  /** 文本内容 */
  content: string
}

/** 智能会话对象 */
export interface AiChat {
  /** 会话 ID */
  id: string
  /** 消息列表 */
  messages: AiChatMessage[]
}

/**
 * 创建一个新的智能会话
 */
export function createAiChat(): Promise<AiChat> {
  return requestForData({
    method: 'POST',
    url: '/ai/chat',
    auth: false,
  })
}

/** 为已有的会话添加消息 */
export function appendMessage(chatId: string, prompt: string): Promise<AiChat> {
  return requestForData({
    method: 'PUT',
    url: `/ai/chat/${chatId}`,
    auth: false,
    data: {prompt},
  })
}
