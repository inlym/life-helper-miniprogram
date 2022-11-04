import dayjs from 'dayjs'
import {requestForData} from '../core/http'
import {calcWeekdayText} from '../utils/time'
import {F2dItem, MixedWeatherData, TempBar, WeatherDailyItem, WeatherHourlyItem} from './weather-data.interface'

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

/** 天气数据整合 */
export interface WeatherDataVO {
  now: WeatherNow

  daily: WeatherDaily[]

  hourly: WeatherHourly[]

  rain: MinutelyRain

  airNow: AirNow

  airDaily: AirDaily

  /** 用于展示的地点名称 */
  locationName: string
}

/**
 * 处理天气数据
 *
 * @param data 天气数据
 */
export function processWeatherData(data: MixedWeatherData): MixedWeatherData {
  data.f15d.forEach((item: WeatherDailyItem) => {
    item.weekday = calcWeekdayText(item.date)
    const d = dayjs(item.date)
    item.simpleDate = `${d.month() + 1}/${d.date()}`
  })

  // 处理未来 24 小时预报数据
  data.f24h.forEach((item: WeatherHourlyItem, index: number) => {
    const t = dayjs(item.time)
    const now = dayjs()

    if (now.isSame(t, 'hour')) {
      item.timeText = '现在'
    } else if (t.hour() === 0 && index > 0) {
      const month = t.month() + 1
      const day = t.date()
      item.timeText = `${month}/${day}`
    } else {
      const hour = t.hour()
      item.timeText = `${hour}:00`
    }
  })

  // 处理未来2天的天气数据
  const todayDaily = data.f15d.find((item: WeatherDailyItem) => item.weekday === '今天')!
  const tomorrowDaily = data.f15d.find((item: WeatherDailyItem) => item.weekday === '明天')!

  const f2d: F2dItem[] = []
  f2d[0] = {
    date: todayDaily.date,
    weekday: '今天',
    text: todayDaily.text,
    tempMax: todayDaily.tempMax,
    tempMin: todayDaily.tempMin,
    aqiCategory: todayDaily.aqiCategory,
    aqiLevel: todayDaily.aqiLevel,
  }
  f2d[1] = {
    date: tomorrowDaily.date,
    weekday: '明天',
    text: tomorrowDaily.text,
    tempMax: tomorrowDaily.tempMax,
    tempMin: tomorrowDaily.tempMin,
    aqiCategory: tomorrowDaily.aqiCategory,
    aqiLevel: tomorrowDaily.aqiLevel,
  }

  data.f2d = f2d

  // 处理当前 IP 定位的位置天气数据
  if (data.location) {
    data.currentLocationWeather = {
      name: data.location.name,
      region: data.location.region,
      iconUrl: data.now.iconUrl,
      type: data.now.type,
      temp: data.now.temp,
    }
  }

  // 附上温度条数据
  data.tempBars = getTempBarList(data.f15d)

  // 从未来15天列表中抽取今天的记录
  data.todayFromDaily = data.f15d.find((item: WeatherDailyItem) => item.weekday === '今天')!

  return data
}

/**
 * 获取汇总的天气数据
 */
export async function getMixedWeatherDataAnonymous(): Promise<MixedWeatherData> {
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
export async function getMixedWeatherDataByPlaceId(placeId: number): Promise<MixedWeatherData> {
  const data = await requestForData({
    method: 'GET',
    url: '/weather',
    params: {place_id: placeId},
    auth: true,
  })

  return processWeatherData(data)
}

/**
 * 生成温度条数据
 *
 * @param list 未来15天预报数据
 */
export function getTempBarList(list: WeatherDailyItem[]): TempBar[] {
  /** 父元素的高度 */
  const boxHeight = 200

  const maxList: number[] = list.map((item: WeatherDailyItem) => parseInt(item.tempMax))
  const minList: number[] = list.map((item: WeatherDailyItem) => parseInt(item.tempMin))

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
