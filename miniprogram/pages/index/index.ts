import {drawWeatherHourlyLineChart} from '../../app/services/weather-canvas'
import {getMixedWeatherDataAnonymous} from '../../app/services/weather-data'
import {
  AirNow,
  F2dItem,
  TempBar,
  WarningItem,
  WeatherDailyItem,
  WeatherHourlyItem,
  WeatherNow,
} from '../../app/services/weather-data.interface'
import {createCanvasContext} from '../../app/utils/canvas'
import {themeBehavior} from '../../behaviors/theme-behavior'

Page<any, Record<string, any>>({
  data: {
    // ---------------------------- 从 HTTP 请求获取的数据 ----------------------------

    now: {} as WeatherNow,
    f24h: [] as WeatherHourlyItem[],
    airNow: {} as AirNow,
    f15d: [] as WeatherDailyItem[],
    warnings: [] as WarningItem[],

    // ------------------------ 从 HTTP 请求获取二次处理后的数据 -----------------------

    /** 顶部显示的地点名称 */
    locationName: '正在获取定位 ...',

    /** 未来2天预报 */
    f2d: [] as F2dItem[],

    /** 未来15天预报的温度条 */
    tempBars: [] as TempBar[],

    // -------------------------------- 其他页面数据 --------------------------------

    /** 地理位置栏与顶部的闲置高度，单位：px */
    reservedHeight: 80,

    /** 时钟：早6至晚6为 'day`，其余为 'night' */
    clock: 'day',

    /** 图标颜色，跟时钟对应，白天为黑色，晚上为白色 */
    iconColor: '#000',

    /** 当前选中的天气地点 ID */
    currentPlaceId: 0,
  },

  behaviors: [themeBehavior],

  onLoad() {
    this.start()
  },

  async start() {
    this.setClock()
    this.setReservedHeight()

    await this.getWeatherDataAnonymous()
    await this.afterGettingData()
  },

  /** 获取时钟并设置相关值 */
  setClock() {
    const hour = new Date().getHours()
    const clock = hour >= 6 && hour < 18 ? 'day' : 'night'
    const iconColor = clock === 'day' ? '#000' : '#fff'
    this.setData({clock, iconColor})
  },

  /** 获取并设置保留高度 */
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
    this.setData({locationName})
  },

  /** 在获取天气数据后执行 */
  async afterGettingData() {
    const ctx = await createCanvasContext('#f24h')
    drawWeatherHourlyLineChart(ctx, this.data.f24h, this.data.theme)
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
})
