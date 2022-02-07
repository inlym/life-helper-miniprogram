import { request } from '../core/request'

/**
 * 获取天气数据
 *
 * @param cityId 城市 ID
 */
export async function getWeather(cityId?: number): Promise<any> {
  const response = await request({
    method: 'GET',
    url: '/weather',
    params: { city_id: cityId },
  })
  return response.data
}
