import {
  AirDaily,
  AirNow,
  getMixedWeatherData,
  IndicesItem,
  MinutelyRain,
  WeatherDaily,
  WeatherHourly,
  WeatherNow,
} from '../../app/services/weather'

Page({
  data: {
    // 天气数据
    air5d: [] as AirDaily[],
    airNow: {} as AirNow,
    f15d: [] as WeatherDaily[],
    f24h: [] as WeatherHourly[],
    indices3d: [] as IndicesItem[],
    now: {} as WeatherNow,
    rain: {} as MinutelyRain,

    // 页面描述数据

    /** 白天还是夜晚( 'day' | 'night' ) */
    clock: 'night',

    /** 天气类型: 'sun', 'cloudy', 'rain', 'snow', 'haze' */
    type: 'snow',
  },

  onLoad() {
    // this.init()
  },

  async init() {
    const data = await getMixedWeatherData()
    this.setData(data)
  },
})
