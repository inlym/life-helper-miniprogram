import {drawWeatherHourlyLineChart} from '../../app/services/weather-canvas'
import {getMixedWeatherDataAnonymous, getMixedWeatherDataByPlaceId} from '../../app/services/weather-data'
import {
  AirNow,
  F2dItem,
  Location,
  TempBar,
  WarningItem,
  WeatherDailyItem,
  WeatherHourlyItem,
  WeatherNow,
} from '../../app/services/weather-data.interface'
import {createCanvasContext} from '../../app/utils/canvas'
import {TapEvent} from '../../app/utils/types'
import {shareAppBehavior} from '../../behaviors/share-app-behavior'
import {themeBehavior} from '../../behaviors/theme-behavior'

Page({
  data: {
    // ---------------------------- 从 HTTP 请求获取的数据 ----------------------------

    now: {} as WeatherNow,
    f24h: [] as WeatherHourlyItem[],
    airNow: {} as AirNow,
    f15d: [] as WeatherDailyItem[],
    warnings: [] as WarningItem[],
    location: {} as Location,

    // ------------------------ 从 HTTP 请求获取二次处理后的数据 -----------------------

    /** 顶部显示的地点名称 */
    locationName: '正在获取定位 ...',

    /** 未来2天预报 */
    f2d: [] as F2dItem[],

    /** 未来15天预报的温度条 */
    tempBars: [] as TempBar[],

    /** 通过 IP 定位获取的实时天气，页面上不使用，带入到其他页面展示 */
    ipLocatedWeatherNow: {} as WeatherNow,

    todayFromDaily: {} as WeatherDailyItem,

    // -------------------------------- 其他页面数据 --------------------------------

    /** 地理位置栏与顶部的闲置高度，单位：px */
    reservedHeight: 80,

    /** 时钟：早6至晚6为 'day`，其余为 'night' */
    clock: 'day',

    /** 图标颜色，跟时钟对应，白天为黑色，晚上为白色 */
    iconColor: '#000',

    /** 当前选中的天气地点 ID */
    currentPlaceId: 0,

    f24Canvas: {} as CanvasRenderingContext2D,
  },

  behaviors: [themeBehavior, shareAppBehavior],

  onReady() {
    this.setReservedHeight()

    this.start()
  },

  onPullDownRefresh() {
    this.start().then(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      })
    })
  },

  async start() {
    this.setClock()

    if (this.data.currentPlaceId) {
      await this.getWeatherDataByPlaceId(this.data.currentPlaceId)
    } else {
      await this.getWeatherDataAnonymous()
    }
  },

  /** 获取时钟并设置相关值 */
  setClock() {
    const hour = new Date().getHours()
    const clock = hour >= 6 && hour < 18 ? 'day' : 'night'
    const iconColor = clock === 'day' ? '#000' : '#fff'
    this.setData({clock, iconColor})
  },

  /** 获取并设置保留高度，只需在初始化时执行一次即可 */
  setReservedHeight() {
    const rect = wx.getMenuButtonBoundingClientRect()
    this.setData({reservedHeight: rect.top - 4})
  },

  /** 通过 IP 获取天气数据（即不带任何参数） */
  async getWeatherDataAnonymous() {
    this.setData({currentPlaceId: 0})
    const data = await getMixedWeatherDataAnonymous()
    this.setData(data)
    const locationName = data.location.name
    const ipLocatedWeatherNow = data.now
    this.setData({locationName, ipLocatedWeatherNow})

    await this.afterGettingData()
  },

  /** 通过天气地点 ID 获取天气数据 */
  async getWeatherDataByPlaceId(placeId: number) {
    this.setData({currentPlaceId: placeId})
    const data = await getMixedWeatherDataByPlaceId(placeId)
    this.setData(data)
    const locationName = data.place.name
    this.setData({locationName})

    await this.afterGettingData()
  },

  /** 在获取天气数据后执行 */
  async afterGettingData() {
    let ctx: CanvasRenderingContext2D
    if (!this.data.f24Canvas.canvas) {
      ctx = await createCanvasContext('#f24h')
      this.setData({f24Canvas: ctx})
    } else {
      ctx = this.data.f24Canvas
    }

    const theme = wx.getSystemInfoSync().theme || 'light'
    drawWeatherHourlyLineChart(ctx, this.data.f24h, theme)
  },

  /** 跳转到天气预警页面 */
  navigateToWarningPage() {
    const warnings = this.data.warnings

    wx.navigateTo({
      url: '/pages/weather/warning/warning',
      success(res) {
        res.eventChannel.emit('transferData', warnings)
      },
    })
  },

  /** 跳转到天气地点页 */
  navigateToPlacePage() {
    const self = this
    const {location, currentPlaceId, ipLocatedWeatherNow} = this.data

    wx.navigateTo({
      url: '/pages/weather/place/place',
      success(res) {
        res.eventChannel.emit('transferData', {location, currentPlaceId, ipLocatedWeatherNow})
      },
      events: {
        async switchPlace(data: any) {
          const placeId = data.currentPlaceId
          if (placeId !== self.data.currentPlaceId) {
            if (placeId === 0) {
              await self.getWeatherDataAnonymous()
            } else {
              await self.getWeatherDataByPlaceId(placeId)
            }
            wx.showToast({title: '更新成功', icon: 'success'})
          }
        },
      },
    })
  },

  /** 跳转到逐日预报页 */
  navigateToDailyPage(event: TapEvent<{date: string}>) {
    const date = event.currentTarget.dataset.date
    const {f15d, locationName} = this.data

    wx.navigateTo({
      url: '/pages/weather/daily/daily',
      success(res) {
        res.eventChannel.emit('transferData', {f15d, date, locationName})
      },
    })
  },
})
