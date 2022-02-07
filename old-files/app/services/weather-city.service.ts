import { request } from '../core/request'

/** 添加新的天气城市 - 响应数据 */
export interface AddWeatherCityResponse {
  /** 新增的城市 ID */
  id: number
}

/**
 * 添加新的关注天气城市
 */
export async function addWeatherCity(): Promise<AddWeatherCityResponse | void> {
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
      method: 'POST',
      url: '/weather/city',
      data: location,
    })

    return response.data
  }
}
