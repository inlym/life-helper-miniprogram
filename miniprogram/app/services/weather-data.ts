import {requestForData} from '../core/http'
import {calcWeekdayText} from '../utils/time'

/** 天气中的“风” */
export interface Wind {
  /** 风向 360 角度，示例："45" */
  angle: string

  /** 风向，示例："东北风" */
  direction: string

  /** 风力等级，示例："3-4" */
  scale: string

  /** 风速（km/h），示例："16" */
  speed: string
}

/** 星球（在天气模块特指太阳和月亮） */
export interface Star {
  /** 升起时间，指日出和月出 */
  riseTime: string

  /** 落下时间，指日落和月落 */
  setTime: string
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

  /** 空气质量的主要污染物，空气质量为优时，返回值为 "NA" */
  primary: string
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

/** 实时天气数据 */
export interface WeatherNow {
  /** 天气图标的 URL 地址 */
  iconUrl: string

  /** 自行归纳的天气类型 */
  type: string

  /** 风相关元素 */
  wind: Wind

  /** 当前 API 的最近更新时间 */
  updateTime: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string
}

export interface WeatherDailyHalfDay {
  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string

  /** 天气图标的 URL 地址 */
  iconUrl: string

  wind: Wind
}

/** 逐天天气预报中单天的数据详情 */
export interface WeatherDaily {
  /** 预报日期，格式示例：2022-04-29 */
  date: string

  /** 缩略日期格式，格式示例：4/29 */
  simpleDate: string

  day: WeatherDailyHalfDay

  night: WeatherDailyHalfDay

  /** 月相图标 URL 地址 */
  moonPhaseIconUrl: string

  /** 天气总结，示例：晴转多云 */
  text: string

  /** 日出日落 */
  sun: Star

  /** 月升月落 */
  moon: Star

  /** 空气质量预报 */
  air: AirDaily

  /** 月相名称 */
  moonPhase: string

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

/** 二次处理后新增的字段 */
export interface WeatherDaily {
  weekday: string
}

/** 逐小时天气预报中的单小时数据详情 */
export interface WeatherHourly {
  /** 预报时间 */
  time: string

  /** 天气状况和图标 URL 地址 */
  iconUrl: string

  /** 风 */
  wind: Wind

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况的文字描述 */
  text: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string

  /** 逐小时预报降水概率，百分比数值，可能为空 */
  pop: string

  /** 大气压强，默认单位：百帕 */
  pressure: string
}

export interface MinutelyRainItem {
  /** 预报时间 */
  time: string

  /** 10分钟累计降水量，单位毫米 */
  precip: number
}

export interface MinutelyRain {
  /**
   * 是否有雨
   *
   * <h2>字段规则
   * <p>遍历列表降水量值，只要存在不为零的项，该值即为 true
   */
  hasRain: boolean

  /**
   * 降水类型: - rain -> 雨 / snow -> 雪
   */
  type: string

  /** 当前 API 的最近更新时间 */
  updateTime: string

  /** 分钟降水描述 */
  summary: string

  minutely: MinutelyRainItem[]
}

/** 生活指数的中的单天详情 */
export interface DailyIndex {
  /** 格式化显示的日期 */
  formattedDate: string

  /** 人性化显示的“周几” */
  optimalDayOfWeek: string

  /** 预报日期 */
  date: string

  /** 生活指数预报等级 */
  level: string

  /** 生活指数预报级别名称 */
  category: string

  /** 生活指数预报的详细描述，可能为空 */
  text: string
}

export interface LivingIndex {
  /** 图片 URL */
  imageUrl: string

  /** 生活指数类型 ID */
  type: string

  /** 生活指数类型的名称 */
  name: string

  daily: DailyIndex[]
}

/** 增强版的单日详情，用于显示今日列表 */
export interface EnhancedDailyIndex extends DailyIndex {
  /** 图片 URL */
  imageUrl: string

  /** 生活指数类型 ID */
  type: string

  /** 生活指数类型的名称 */
  name: string
}

/** 天气灾害预警信息 */
export interface WarningNow {
  /** 图片的 URL 地址 */
  imageUrl: string

  /** 预警名称，示例："暴雨红色预警" */
  name: string

  /** 本条预警的唯一标识，可判断本条预警是否已经存在 */
  id: string

  /** 预警发布时间 */
  pubTime: string

  /** 预警信息标题 */
  title: string

  /** 预警类型 ID */
  type: string

  /** 预警类型名称 */
  typeName: string

  /** 预警详细文字描述 */
  text: string
}

/** 天气数据整合 */
export interface WeatherData {
  now: WeatherNow

  daily: WeatherDaily[]

  hourly: WeatherHourly[]

  rain: MinutelyRain

  indices: LivingIndex[]

  airNow: AirNow

  warnings: WarningNow[]

  /** 用于展示的地点名称 */
  locationName: string

  /** 当前日期 */
  date: string
}

/** 逐日天气的温度条 */
export interface TempBar {
  /** 用于外部的父元素 */
  paddingTop: number

  /** 用于子元素 */
  height: number
}

/** 二次处理后附加的数据 */
export interface WeatherData {
  tempBars: TempBar[]

  /** 今天和明天的逐日预报 */
  f2d: WeatherDaily[]

  /** 今日生活指数 */
  todayIndex: EnhancedDailyIndex[]
}

/**
 * 处理逐日天气预报的单天数据
 */
export function processWeatherDaily(data: WeatherDaily): WeatherDaily {
  data.weekday = calcWeekdayText(data.date)
  return data
}

/**
 * 获取今日生活指数
 *
 * @param indices 原始的生活指数数据
 *
 * @since 1.6.0
 */
export function getTodayIndex(indices: LivingIndex[]): EnhancedDailyIndex[] {
  return indices.map((item: LivingIndex) => {
    console.log(item)
    const result: EnhancedDailyIndex = item.daily.find(
      (day: DailyIndex) => day.optimalDayOfWeek === '今天'
    )! as EnhancedDailyIndex

    result.imageUrl = item.imageUrl
    result.type = item.type
    result.name = item.name

    return result
  })
}

/**
 * 处理天气数据
 *
 * @param data 天气数据
 */
export function processWeatherData(data: WeatherData): WeatherData {
  data.daily.forEach((item) => processWeatherDaily(item))

  // 抽取今明两天列表
  const todayIndex = data.daily.findIndex((item) => item.weekday === '今天')
  data.f2d = data.daily.slice(todayIndex, todayIndex + 2)

  data.tempBars = getTempBarList(data.daily)

  // 抽取今日生活指数
  data.todayIndex = getTodayIndex(data.indices)

  return data
}

/**
 * 获取天气数据（默认方式，根据 IP 定位获取）
 */
export async function getWeatherDataAnonymous(): Promise<WeatherData> {
  const data = await requestForData({
    method: 'GET',
    url: '/weather',
    auth: false,
    loading: true,
  })

  return processWeatherData(data)
}

/**
 * 根据天气地点 ID 获取天气数据
 *
 * @param placeId 天气地点 ID
 */
export async function getWeatherDataByPlaceId(placeId: string): Promise<WeatherData> {
  const data = await requestForData({
    method: 'GET',
    url: '/weather',
    params: {place_id: placeId},
    auth: true,
  })

  return processWeatherData(data)
}

/**
 * 生成逐日天气温度条数据
 *
 * @param list 未来15天预报数据
 */
export function getTempBarList(list: WeatherDaily[]): TempBar[] {
  /** 父元素的高度 */
  const boxHeight = 200

  const maxList: number[] = list.map((item: WeatherDaily) => parseInt(item.day.temp))
  const minList: number[] = list.map((item: WeatherDaily) => parseInt(item.night.temp))

  const max = Math.max(...maxList)
  const min = Math.min(...minList)

  /** 每一摄氏度占有的高度 */
  const heightPerTemp = boxHeight / (max - min)

  const tempBarList: TempBar[] = []

  for (let i = 0; i < list.length; i++) {
    const paddingTop = (max - maxList[i]) * heightPerTemp
    const height = (maxList[i] - minList[i]) * heightPerTemp
    tempBarList.push({paddingTop, height})
  }

  return tempBarList
}
