/** 经纬度坐标组合 */
import dayjs from 'dayjs'
import {requestForData} from '../core/http'
import {calcWeekdayText} from '../utils/time'
import {F2dItem, MixedWeatherData, TempBar, WeatherDailyItem, WeatherHourlyItem} from './weather-data.interface'

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
  const todayDaily = data.f15d.find((item: WeatherDailyItem) => item.weekday === '今天')
  const tomorrowDaily = data.f15d.find((item: WeatherDailyItem) => item.weekday === '明天')

  const f2d: F2dItem[] = []
  f2d[0] = {
    weekday: '今天',
    text: todayDaily!.text,
    tempMax: todayDaily!.tempMax,
    tempMin: todayDaily!.tempMin,
    aqiCategory: todayDaily!.aqiCategory,
    aqiLevel: todayDaily!.aqiLevel,
  }
  f2d[1] = {
    weekday: '明天',
    text: tomorrowDaily!.text,
    tempMax: tomorrowDaily!.tempMax,
    tempMin: tomorrowDaily!.tempMin,
    aqiCategory: tomorrowDaily!.aqiCategory,
    aqiLevel: tomorrowDaily!.aqiLevel,
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
