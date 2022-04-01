/** 天气地点 */
import {requestForData} from '../core/http'
import {ChooseLocationSuccessCallbackResult} from '../utils/wx-typings'

/** 天气地点 */
export interface WeatherPlace {
  /** 主键 ID */
  id: number

  /** 地点名称 */
  name: string

  /** 地区名称，例如：“杭州市西湖区” */
  region: string
}

/**
 * 新增一个天气地点
 * @param result 微信选择定位的结果
 */
export function addWeatherPlace(result: ChooseLocationSuccessCallbackResult): Promise<WeatherPlace> {
  return requestForData({
    method: 'POST',
    url: '/weather/place',
    data: result,
    auth: true,
  })
}

export interface GetWeatherPlacesResult {
  list: WeatherPlace[]
}

/**
 * 获取天气地点列表
 */
export async function getWeatherPlaces(): Promise<WeatherPlace[]> {
  const data = await requestForData<GetWeatherPlacesResult>({
    method: 'GET',
    url: '/weather/places',
    auth: true,
  })

  return data.list
}

export interface RemoveWeatherPlaceResult {
  id: number
}

/**
 * 移除一个天气地点
 *
 * @param id 主键 ID
 */
export function removeWeatherPlace(id: number): Promise<RemoveWeatherPlaceResult> {
  return requestForData<RemoveWeatherPlaceResult>({
    method: 'DELETE',
    url: `/weather/place/${id}`,
    auth: true,
  })
}
