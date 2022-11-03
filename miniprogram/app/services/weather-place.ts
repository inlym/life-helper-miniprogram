/** 天气地点 */
import {StorageField} from '../core/constant'
import {requestForData} from '../core/http'
import {enhancedStorage} from '../core/storage'

/** 基础天气数据 */
export interface BasicWeather {
  /** 天气图标的 URL 地址 */
  iconUrl: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string
}

/** 天气地点 */
export interface WeatherPlace {
  /** 地点 ID */
  id: string

  /** 位置名称 */
  name: string

  /** 所在地区，市 + 区，例如：“杭州市西湖区” */
  region: string

  /** 附带的天气数据 */
  weather: BasicWeather
}

/** 删除天气地点响应数据 */
export type DeleteWeatherPlaceResponse = Pick<WeatherPlace, 'id'>

/** IP 定位地点 */
export interface IpLocatedPlace {
  /** 地点名称，取“市”，例如“杭州市” */
  name: string

  /** 附带的天气数据 */
  weather: BasicWeather
}

/** 获取天气地点列表响应数据 */
export interface GetWeatherPlaceListResponse {
  /** 天气地点列表 */
  list: WeatherPlace[]

  /** IP 定位地点 */
  ipLocated: IpLocatedPlace
}

/**
 * 新增一个天气地点
 *
 * @param result 微信选择定位的结果
 */
export function addWeatherPlace(result: WechatMiniprogram.ChooseLocationSuccessCallback): Promise<WeatherPlace> {
  return requestForData({
    method: 'POST',
    url: '/weather/place',
    data: result,
    auth: true,
  })
}

/**
 * 删除天气地点
 *
 * @param id 天气地点 ID
 */
export function deleteWeatherPlace(id: string): Promise<DeleteWeatherPlaceResponse> {
  return requestForData({
    method: 'DELETE',
    url: `/weather/place/${id}`,
    auth: true,
  })
}

/**
 * 获取天气地点列表
 */
export function getWeatherPlaceList(): Promise<GetWeatherPlaceListResponse> {
  return requestForData({
    method: 'GET',
    url: '/weather/places',
    auth: true,
  })
}

/**
 * 获取当前选中的天气地点 ID
 */
export function getSelectWeatherPlaceId(): string {
  const id = enhancedStorage.get(StorageField.SELECTED_WEATHER_PLACE_ID)
  return id ? id : ''
}

/**
 * 设置当前选中的天气地点 ID
 */
export function setSelectWeatherPlaceId(id: string): void {
  enhancedStorage.set(StorageField.SELECTED_WEATHER_PLACE_ID, id)
}

/**
 * 设置当前选中的天气地点 ID
 */
export function removeSelectWeatherPlaceId(): void {
  enhancedStorage.remove(StorageField.SELECTED_WEATHER_PLACE_ID)
}
