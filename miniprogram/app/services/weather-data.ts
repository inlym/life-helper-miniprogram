/** 经纬度坐标组合 */
import dayjs from 'dayjs'
import {requestForData} from '../core/http'
import {calcWeekdayText} from '../utils/time'
import {MixedWeatherData, WeatherDaily, WeatherHourly} from './weather-data.interface'

/**
 * 处理天气数据
 *
 * @param data 天气数据
 */
export function processWeatherData(data: MixedWeatherData): MixedWeatherData {
  data.f15d.forEach((item: WeatherDaily) => {
    item.weekday = calcWeekdayText(item.date)
    const d = dayjs(item.date)
    item.simpleDate = `${d.month()}/${d.date()}`
  })

  data.f24h.forEach((item: WeatherHourly, index: number) => {
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
      item.timeText = `${hour}时`
    }
  })

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
