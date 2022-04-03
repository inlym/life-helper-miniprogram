import {drawWeatherDailyLineChart} from '../../app/services/weather-canvas'
import {getMixedWeatherDataAnonymous, getMixedWeatherDataByPlaceId} from '../../app/services/weather-data'
import {
  AirDaily,
  AirNow,
  IndicesItem,
  Location,
  MinutelyRain,
  WeatherDaily,
  WeatherHourly,
  WeatherNow,
} from '../../app/services/weather-data.interface'
import {getWeatherPlaces} from '../../app/services/weather-place'
import {WeatherPlace} from '../../app/services/weather-place.interface'
import {createCanvasContext} from '../../app/utils/canvas'
import {BaseEvent} from '../../app/utils/wx-typings'

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
    now: {} as WeatherNow,
    rain: {} as MinutelyRain,
    place: {} as WeatherPlace,
    f2d: [] as F2dItem[],

    /** 由 IP 地址获取的地理位置 */
    location: {} as Location,

    /** 天气地点列表 */
    places: [] as WeatherPlace[],

    /** 当前选中的天气地点 */
    currentPlaceId: 0,

    /** 顶部显示的地点名称 */
    locationName: '',

    // 页面描述数据

    /** 地理位置栏与顶部的闲置高度，单位：px */
    reservedHeight: 80,

    /** 是否展示页面容器 */
    showPageContainer: false,

    /** 'day' | 'night' */
    clock: 'day',

    /** 区分白天黑夜的图标的颜色 */
    iconColor: '#000',
  },

  onLoad() {
    this.calcReservedHeight()

    // 原来各种事件要放在这里处理的，现在放到 onReady 处理了
  },

  async onReady() {
    await this.init()
  },

  async init() {
    this.setClock()
    await this.getWeatherDataAnonymous()
    this.getWeatherPlaces()
  },

  getClock() {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 6 && hour < 18) {
      return 'day'
    } else {
      return 'night'
    }
  },

  setClock() {
    const clock = this.getClock()
    const iconColor = clock === 'day' ? '#000' : '#fff'
    this.setData({clock, iconColor})
  },

  /** 通过 IP 获取天气数据（即不带任何参数） */
  async getWeatherDataAnonymous() {
    this.setData({currentPlaceId: 0})
    const data = await getMixedWeatherDataAnonymous()
    this.setData(data)
    const locationName = data.location.name
    this.setData({locationName})
    this.afterGettingWeatherData()
  },

  /** 通过天气地点 ID 获取天气数据 */
  async getWeatherDataByPlaceId(placeId: number) {
    const data = await getMixedWeatherDataByPlaceId(placeId)
    this.setData(data)
    const locationName = data.place.name
    this.setData({locationName})
    this.afterGettingWeatherData()
  },

  /** 获取天气数据后要做的事情 */
  async afterGettingWeatherData() {
    const ctx = await createCanvasContext('#f15d')
    drawWeatherDailyLineChart(ctx, this.data.f15d)
  },

  /** 获取天气地点列表 */
  async getWeatherPlaces(): Promise<void> {
    const list = await getWeatherPlaces()
    this.setData({places: list})
  },

  /** 计算预留高度 */
  calcReservedHeight() {
    const rect = wx.getMenuButtonBoundingClientRect()
    this.setData({reservedHeight: rect.top - 4})
  },

  /** 处理位置条点击事件 */
  handleLocationBarTap() {
    this.setData({showPageContainer: true})
  },

  /** 关闭半页容器 */
  closePageContainer() {
    this.setData({showPageContainer: false})
  },

  /** 处理点击当前位置栏目 */
  handleLocationItemTap() {
    if (this.data.currentPlaceId !== 0) {
      this.setData({currentPlaceId: 0})
      this.getWeatherDataAnonymous()
    }
    this.closePageContainer()
  },

  /** 处理天气地点列表项目点击事件 */
  handlePlaceItemTap(e: BaseEvent) {
    const placeId = e.currentTarget.dataset.id
    if (placeId !== this.data.currentPlaceId) {
      this.setData({currentPlaceId: placeId})
      this.getWeatherDataByPlaceId(placeId)
    }
    this.closePageContainer()
  },
})
