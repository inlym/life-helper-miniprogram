import {WeatherPlace} from './weather-place.interface'

/** 实时天气数据 */
export interface WeatherNow {
  /** 当前 API 的最近更新时间，不是原接口返回的时间节点，而是该时间与当前时间的时间差，单位：分钟 */
  updateMinutesDiff: string

  /** 图标的 URL 地址 */
  iconUrl: string

  /** 自行归纳的天气类型 */
  type: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 体感温度，默认单位：摄氏度 */
  feelsLike: string

  /** 天气状况和图标的代码 */
  icon: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string

  /** 风向360角度 */
  wind360: string

  /** 风向 */
  windDir: string

  /** 风力等级 */
  windScale: string

  /** 风速，公里/小时 */
  windSpeed: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string
}

/** 逐天天气预报中单天的数据详情 */
export interface WeatherDailyItem {
  // 处理后增加的字段
  weekday: string

  /** 03/19 格式的日期 */
  simpleDate: string

  // 接口返回的数据
  /** 预报日期 */
  date: string

  /** 预报白天天气状况的图标 URL 地址 */
  iconDayUrl: string

  /** 预报夜间天气状况的图标 URL 地址 */
  iconNightUrl: string

  /** 日出时间 */
  sunrise: string

  /** 日落时间 */
  sunset: string

  /** 月升时间 */
  moonrise: string

  /** 月落时间 */
  moonset: string

  /** 月相名称 */
  moonPhase: string

  /** 月相图标代码 */
  moonPhaseIcon: string

  /** 预报当天最高温度 */
  tempMax: string

  /** 预报当天最低温度 */
  tempMin: string

  /** 文字描述 */
  text: string

  /** 预报白天天气状况文字描述 */
  textDay: string

  /** 预报晚间天气状况文字描述 */
  textNight: string

  /** 预报白天风向360角度 */
  wind360Day: string

  /** 预报白天风向 */
  windDirDay: string

  /** 预报白天风力等级 */
  windScaleDay: string

  /** 预报白天风速，公里/小时 */
  windSpeedDay: string

  /** 预报夜间风向360角度 */
  wind360Night: string

  /** 预报夜间当天风向 */
  windDirNight: string

  /** 预报夜间风力等级 */
  windScaleNight: string

  /** 预报夜间风速，公里/小时 */
  windSpeedNight: string

  /** 预报当天总降水量，默认单位：毫米 */
  precip: string

  /** 紫外线强度指数 */
  uvIndex: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string
}

/** 逐小时天气预报中的单小时数据详情 */
export interface WeatherHourlyItem {
  // 处理后增加的字段
  timeText: string

  // 接口返回的数据

  /** 预报时间 */
  time: string

  /** 天气状况和图标 URL 地址 */
  iconUrl: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况的文字描述 */
  text: string

  /** 风向360角度 */
  wind360: string

  /** 风向 */
  windDir: string

  /** 风力等级 */
  windScale: string

  /** 风速，公里/小时 */
  windSpeed: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string

  /** 逐小时预报降水概率，百分比数值，可能为空 */
  pop: string

  /** 大气压强，默认单位：百帕 */
  pressure: string
}

/** 分钟级降水的列表项数据 */
export interface MinutelyRainItem {
  /** 预报时间，只保留时和分，格式示例 `19:06` */
  time: string

  /** 10分钟累计降水量，单位毫米 */
  precip: string

  /**
   * 降水类型:
   * - rain -> 雨
   * - snow -> 雪
   */
  type: 'rain' | 'snow'
}

/** 分钟级降水数据 */
export interface MinutelyRain {
  /** 当前 API 的最近更新时间，不是原接口返回的时间节点，而是该时间与当前时间的时间差，单位：分钟 */
  updateMinutesDiff: string

  /** 分钟降水描述 */
  summary: string

  /** 列表数据 */
  minutely: MinutelyRainItem[]
}

/** 天气生活指数中的单天详情 */
export interface IndicesItem {
  /** 图片 URL */
  imageUrl: string

  /** 预报日期 */
  date: string

  /** 生活指数类型ID */
  type: string

  /** 生活指数类型的名称 */
  name: string

  /** 生活指数预报等级 */
  level: string

  /** 生活指数预报级别名称 */
  category: string

  /** 生活指数预报的详细描述，可能为空 */
  text: string
}

/** 实时空气质量数据 */
export interface AirNow {
  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为NA */
  primary: string

  /** PM10 */
  pm10: string

  /** PM2.5 */
  pm2p5: string

  /** 二氧化氮 */
  no2: string

  /** 二氧化硫 */
  so2: string

  /** 一氧化碳 */
  co: string

  /** 臭氧 */
  o3: string
}

/** 空气质量逐天预报中的单天详情 */
export interface AirDaily {
  /** 预报日期 */
  date: string

  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 NA */
  primary: string
}

/** 地理位置 */
export interface Location {
  /** 位置名称，一般是“区” */
  name: string

  /** 所在区域，一般是省+市，例如“浙江省杭州市” */
  region: string
}

/** 未来2天预报项目 */
export interface F2dItem {
  weekday: '今天' | '明天'

  text: string

  tempMax: string

  tempMin: string

  aqiCategory: string

  aqiLevel: string
}

/** 当前使用 IP 定位的地区的天气，数据来源于位置和实时天气 */
export interface CurrentLocationWeather {
  /** 位置名称，一般是“区” */
  name: string

  /** 所在区域，一般是省+市，例如“浙江省杭州市” */
  region: string

  /** 图标的 URL 地址 */
  iconUrl: string

  /** 自行归纳的天气类型 */
  type: string

  /** 温度，默认单位：摄氏度 */
  temp: string
}

export interface MixedWeatherData {
  air5d: AirDaily[]

  airNow: AirNow

  f15d: WeatherDailyItem[]

  f24h: WeatherHourlyItem[]

  indices3d: IndicesItem[]

  now: WeatherNow

  rain: MinutelyRain

  // location 和 place 只会同时存在一个
  // 当不带参数查询时，服务端根据 IP 地址查询定位返回 location
  // 当使用地点 ID 查询时，返回这个 ID 对应的 place

  location: Location

  place: WeatherPlace

  // 自己添加在字段
  f2d: F2dItem[]

  currentLocationWeather: CurrentLocationWeather
}
