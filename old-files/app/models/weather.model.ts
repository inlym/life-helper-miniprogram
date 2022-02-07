/**
 * 实时天气数据
 *
 * @see
 * [实时天气](https://dev.qweather.com/docs/api/weather/weather-now/)
 */
export interface WeatherNow {
  /** 数据观测时间 */
  obsTime: string

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

  /** 云量，百分比数值 */
  cloud: string

  /** 露点温度 */
  dew: string
}

/**
 * 逐天天气预报
 *
 * @see
 * [逐天天气预报](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
 */
export interface DailyForecastItem {
  // 以下为原始数据（未做处理）

  /** 预报日期 */
  date: string

  fxDate: string

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

  /** 最高温度 */
  tempMax: string

  /** 最低温度 */
  tempMin: string

  /** 白天天气状况的图标代码 */
  iconDay: string

  /** 白天天气状况文字描述 */
  textDay: string

  /** 夜间天气状况的图标代码 */
  iconNight: string

  /** 夜间天气状况文字描述 */
  textNight: string

  /** 白天风向360角度 */
  wind360Day: string

  /** 白天风向 */
  windDirDay: string

  /** 白天风力等级 */
  windScaleDay: string

  /** 白天风速，公里/小时 */
  windSpeedDay: string

  /** 夜间风向360角度 */
  wind360Night: string

  /** 夜间当天风向 */
  windDirNight: string

  /** 夜间风力等级 */
  windScaleNight: string

  /** 夜间风速，公里/小时 */
  windSpeedNight: string

  /** 当天总降水量，默认单位：毫米 */
  precip: string

  /** 紫外线强度指数 */
  uvIndex: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string

  /** 云量，百分比数值 */
  cloud: string
}

/**
 * 逐小时天气预报
 *
 * @see
 * [逐小时天气预报](https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/)
 */
export interface HourlyForecastItem {
  /** 预报时间 */
  fxTime: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况和图标的代码 */
  icon: string

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

  /** 云量，百分比数值 */
  cloud: string

  /** 露点温度 */
  dew: string
}

/**
 * 天气预警城市
 *
 * @see
 * [天气预警城市列表](https://dev.qweather.com/docs/api/warning/weather-warning-city-list/)
 */
export interface WarningCity {
  /** 当前国家预警的LocationID */
  locationId: string
}

/**
 * 天气生活指数
 *
 * @see
 * [天气生活指数](https://dev.qweather.com/docs/api/indices/)
 */
export interface LivingIndexItem {
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

  // 自定义部分
  iconUrl: string
}

/**
 * 实时空气质量
 *
 * @see
 * [实时空气质量](https://dev.qweather.com/docs/api/air/air-now/)
 */
export interface AirNow {
  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
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

/**
 * 空气质量预报
 *
 * @see
 * [空气质量预报](https://dev.qweather.com/docs/api/air/air-daily-forecast/)
 */
export interface AirDailyForecastItem {
  /** 预报日期 */
  fxDate: string

  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
  primary: string
}

/**
 * 分钟级降水
 *
 * @see
 * [分钟级降水](https://dev.qweather.com/docs/api/grid-weather/minutely/)
 */
export interface MinutelyRainItem {
  /** 预报时间 */
  fxTime: string

  /** 10分钟累计降水量，单位毫米 */
  precip: string

  /** 降水类型 */
  type: 'rain' | 'snow'
}

/**
 * 天气灾害预警
 *
 * @see
 * [天气灾害预警](https://dev.qweather.com/docs/api/warning/weather-warning/)
 */
export interface WarningNowItem {
  /** 本条预警的唯一标识，可判断本条预警是否已经存在 */
  id: string

  /** 预警发布单位，可能为空 */
  sender?: string

  /** 预警发布时间 */
  pubTime: string

  /** 预警信息标题 */
  title: string

  /** 预警开始时间，可能为空 */
  startTime?: string

  /** 预警结束时间，可能为空 */
  endTime?: string

  /**
   * 预警状态，可能为空
   *
   * ```markdown
   * 1. `active` - 预警中或首次预警
   * 2. `update` - 预警信息更新
   * 3. `cancel` - 取消预警
   * ```
   */
  status?: string

  /** 预警等级 */
  level: string

  /** 预警类型ID */
  type: string

  /** 预警类型名称 */
  typeName: string

  /** 预警详细文字描述 */
  text: string

  /** 与本条预警相关联的预警ID，当预警状态为cancel或update时返回。可能为空 */
  related?: string
}

/**
 * 扩展的实时天气对象
 */
export interface ExtWeatherNow extends WeatherNow {
  /** 观测时间距当前时间的分钟数 */
  obsDiff?: number
}

/**
 * 扩展的逐天预报详情
 */
export interface ExtDailyForecastItem extends DailyForecastItem {
  /** 预报日期 */
  date: string

  /** 昨天、今天、明天、周一、周二等格式文本 */
  dayText: string

  /** `6/15` 格式的月和日文本 */
  dateText: string

  /** `晴转多云` 格式的文字 */
  text: string

  /** 图标（白天） */
  iconDayUrl: string

  /** 图标（晚上） */
  iconNightUrl: string

  /** 天气图片 */
  imageUrl: string

  // -- 小程序附加的 --
  aqi?: ExtAirDailyForecastItem
}

/**
 * 扩展的逐小时天气预报详情
 */
export interface ExtHourlyForecastItem extends HourlyForecastItem {
  /** 预报时间，格式：`06:00` */
  time: string

  /** 图标地址 */
  iconUrl: string
}

/**
 * 扩展的天气生活指数
 */
export interface ExtLivingIndexItem extends LivingIndexItem {
  /** 图标地址 */
  iconUrl: string
}

/**
 * 扩展的实时空气质量
 */
export type ExtAirNow = AirNow

export interface ExtAirDailyForecastItem extends AirDailyForecastItem {
  /** 预报日期 */
  date: string
}

/**
 * 扩展的空气质量预报
 */
export interface ExtMinutelyRainItem extends MinutelyRainItem {
  /** 预报时间 */
  time: string

  /** 用于 CSS 样式的高度 */
  height: string
}

/**
 * 扩展的天气预警城市
 */
export type ExtWarningCity = WarningCity

/**
 * 扩展的天气灾害预警
 */
export type ExtWarningNowItem = WarningNowItem

export interface SkyClass {
  bgClass: string
  sun: boolean
  fixedCloud: boolean
  movingCloud: boolean
  darkCloud: boolean
  fullmoon: boolean
}
