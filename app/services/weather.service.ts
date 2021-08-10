import { request } from '../core/request'

/**
 * 获取天气数据
 *
 * @param cityId 城市 ID
 */
export async function getWeather(cityId?: number): Promise<any> {
  const response = await request({
    url: '/weather',
    params: { id: cityId },
  })
  return response.data
}

export async function getWeather15d(locationId?: string): Promise<any> {
  const response = await request({
    method: 'GET',
    url: '/weather/15d',
    params: { id: locationId },
  })
  return response.data
}
