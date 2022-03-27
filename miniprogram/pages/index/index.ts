import {
  AirDaily,
  AirNow,
  getMixedWeatherData,
  IndicesItem,
  Location,
  MinutelyRain,
  WeatherDaily,
  WeatherHourly,
  WeatherNow,
} from '../../app/services/weather'

interface F2dItem {
  weekday: string
  text: string
  tempMax: string
  tempMin: string
  aqiCategory: string
  aqiLevel: string
}

Page({
  data: {
    // 天气数据
    air5d: [] as AirDaily[],
    airNow: {} as AirNow,
    f15d: [] as WeatherDaily[],
    f24h: [] as WeatherHourly[],
    indices3d: [] as IndicesItem[],
    location: {} as Location,
    now: {} as WeatherNow,
    rain: {} as MinutelyRain,

    // 二次处理后的数据
    f2d: [] as F2dItem[],

    // 页面描述数据

    /** 地理位置栏与顶部的闲置高度，单位：px */
    reservedHeight: 80,
  },

  onLoad() {
    this.calcReservedHeight()
    this.init()
  },

  async init() {
    const data = await getMixedWeatherData()
    this.setData(data)
    this.setF2d()
  },

  /** 计算预留高度 */
  calcReservedHeight() {
    const rect = wx.getMenuButtonBoundingClientRect()
    this.setData({ reservedHeight: rect.top - 4 })
  },

  /** 从未来15天预报中取出今明两天预报 */
  setF2d() {
    const todayDaily = this.data.f15d.find((item: WeatherDaily) => item.weekday === '今天')
    const tomorrowDaily = this.data.f15d.find((item: WeatherDaily) => item.weekday === '明天')

    const todayAqi = this.data.air5d.find((item: AirDaily) => item.date === todayDaily!.date)
    const tomorrowAqi = this.data.air5d.find((item: AirDaily) => item.date === tomorrowDaily!.date)

    const f2d: F2dItem[] = []
    f2d[0] = {
      weekday: '今天',
      text: todayDaily!.text,
      tempMax: todayDaily!.tempMax,
      tempMin: todayDaily!.tempMin,
      aqiCategory: todayAqi!.category,
      aqiLevel: todayAqi!.level,
    }
    f2d[1] = {
      weekday: '明天',
      text: tomorrowDaily!.text,
      tempMax: tomorrowDaily!.tempMax,
      tempMin: tomorrowDaily!.tempMin,
      aqiCategory: tomorrowAqi!.category,
      aqiLevel: tomorrowAqi!.level,
    }

    this.setData({ f2d })
  },
})
