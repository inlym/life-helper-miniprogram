// 「纪念日」模块服务

import dayjs from 'dayjs'
import {requestForData} from '../core/http'

/** 纪念日对象 */
export interface GreatDay {
  /** 纪念日 ID */
  id: string

  /** 纪念日名称 */
  name: string

  /** 日期 */
  date: string

  /** emoji 表情 */
  icon: string

  /**
   * 今天距离纪念日的天数（纪念日减去今天的天数）
   *
   * ### 含义
   * - [ >0 ]：纪念日在未来，还未到。
   * - [ =0 ]：纪念日就是今天。
   * - [ <0 ]：纪念日已过去。
   */
  days: number

  // =============================== 二次处理后新增的字段 ===============================

  /** 格式化的日期 */
  formattedDate: string

  /** 非负的天数 */
  daysAbs: number
}

export type CreateOrUpdateGreatDayDTO = Partial<GreatDay>

/** 获取列表响应数据 */
export interface GreatDayListResponse {
  list: GreatDay[]
}

/** 获取 emoji 列表响应数据 */
export interface EmojiListResponse {
  list: string[]
}

/**
 * 新增
 */
export function createGreatDay(day: CreateOrUpdateGreatDayDTO): Promise<GreatDay> {
  return requestForData({
    method: 'POST',
    url: '/greatday',
    data: day,
    auth: true,
  })
}

/**
 * 删除
 */
export function deleteGreatDay(id: string): Promise<GreatDay> {
  return requestForData({
    method: 'DELETE',
    url: `/greatday/${id}`,
    auth: true,
  })
}

/**
 * 更新
 */
export function updateGreatDay(id: string, day: CreateOrUpdateGreatDayDTO): Promise<GreatDay> {
  return requestForData({
    method: 'PUT',
    url: `/greatday/${id}`,
    data: day,
    auth: true,
  })
}

/**
 * 获取列表
 */
export async function listGreatDay(): Promise<GreatDay[]> {
  const res = await requestForData<GreatDayListResponse>({
    method: 'GET',
    url: '/greatdays',
    auth: true,
  })

  return res.list.map((item) => {
    item.formattedDate = getDateText(item.date)
    item.daysAbs = Math.abs(item.days)
    return item
  })
}

/**
 * 获取单个详情
 */
export function getGreatDayDetail(id: string): Promise<GreatDay> {
  return requestForData({
    method: 'GET',
    url: `/greatday/${id}`,
    auth: true,
  })
}

/** 获取 emoji 列表 */
export async function getEmojiList(): Promise<string[]> {
  const res = await requestForData<EmojiListResponse>({
    method: 'GET',
    url: `/greatday-icon`,
    auth: false,
  })

  return res.list
}

/** 获取文本格式的日期 */
export function getDateText(date: string) {
  const day = dayjs(date)
  const month = day.month() + 1

  return `${day.year()}年${month}月${day.date()}日`
}
