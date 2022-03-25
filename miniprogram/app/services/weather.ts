/** 经纬度坐标组合 */
import { requestForData } from '../core/http'

export interface LocationCoordinate {
  /** 经度 */
  longitude: number

  /** 纬度 */
  latitude: number
}

/**
 * 获取汇总的天气数据
 *
 * @param coordinate 经纬度坐标
 */
export async function getMixedWeatherData(coordinate?: LocationCoordinate) {
  const location = coordinate ? coordinate.longitude + ',' + coordinate.latitude : undefined
  return requestForData({
    method: 'GET',
    url: '/weather',
    params: { location },
    auth: false,
  })
}
