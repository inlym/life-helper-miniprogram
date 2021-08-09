import { request } from '../core/request'
import { goTo } from '../core/route'

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
