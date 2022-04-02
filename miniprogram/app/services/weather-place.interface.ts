/** 天气地点 */
export interface WeatherPlace {
  /** 主键 ID */
  id: number

  /** 地点名称 */
  name: string

  /** 地区名称，例如：“杭州市西湖区” */
  region: string
}

/** 获取天气地点列表响应数据 */
export interface GetWeatherPlacesResult {
  list: WeatherPlace[]
}

/** 移除天气地点响应数据 */
export interface RemoveWeatherPlaceResult {
  id: number
}
