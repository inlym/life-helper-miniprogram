import { request } from '../core/request'

export interface AddWeatherCityResponse {
  name: string

  // todo
}

/**
 * 添加新的关注天气地点
 */
export async function addWeatherCity(): Promise<AddWeatherCityResponse | undefined> {
  const location = await wx.chooseLocation({})

  if (!location.name || !location.address) {
    wx.showModal({
      title: '提示',
      content: '你没有选择地点哦！请点击地点后，再点击右上角的确定',
      showCancel: false,
      confirmText: '我知道了',
    })
    return
  } else {
    const response = await request<AddWeatherCityResponse>({
      url: '/weather/city',
      method: 'POST',
      data: location,
    })

    return response.data
  }
}
