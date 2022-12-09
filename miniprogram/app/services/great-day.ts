// 「纪念日」模块服务

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

  /** 备注 */
  comment: string

  /**
   * 今天距离纪念日的天数（纪念日减去今天的天数）
   *
   * ### 含义
   * - [ >0 ]：纪念日在未来，还未到。
   * - [ =0 ]：纪念日就是今天。
   * - [ <0 ]：纪念日已过去。
   */
  days: number
}

export type CreateOrUpdateGreatDayDTO = Omit<GreatDay, 'id'>

/** 获取列表响应数据 */
export interface GreatDayListResponse {
  list: GreatDay[]
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
export function listGreatDay(): Promise<GreatDayListResponse> {
  return requestForData({
    method: 'GET',
    url: '/greatdays',
    auth: true,
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
