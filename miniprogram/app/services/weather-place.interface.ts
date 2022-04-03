/** 天气地点 */
export interface WeatherPlace {
  /** 主键 ID */
  id: number

  /** 地点名称 */
  name: string

  /** 地区名称，例如：“杭州市西湖区” */
  region: string

  /** 图标的 URL 地址 */
  iconUrl: string

  /** 自行归纳的天气类型 */
  type: string

  /** 日夜类型：day, night */
  clock: string

  /** 温度，默认单位：摄氏度 */
  temp: string
}

/** 获取天气地点列表响应数据 */
export interface GetWeatherPlacesResult {
  list: WeatherPlace[]
}

/** 移除天气地点响应数据 */
export interface RemoveWeatherPlaceResult {
  id: number
}
