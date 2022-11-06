import {
  AirNow,
  getWeatherDataAnonymous,
  getWeatherDataByPlaceId,
  MinutelyRain,
  TempBar,
  WarningNow,
  WeatherDaily,
  WeatherData,
  WeatherHourly,
  WeatherNow,
} from '../../app/services/weather-data'
import {createCanvasContext} from '../../app/utils/canvas'
import {shareAppBehavior} from '../../behaviors/share-app-behavior'
import {themeBehavior} from '../../behaviors/theme-behavior'
import {getSelectWeatherPlaceId} from '../../app/services/weather-place'
import {CommonColor, PageChannelEvent} from '../../app/core/constant'
import {drawWeatherHourlyLineChart} from '../../app/services/weather-canvas'

Page({
  data: {
    // ---------------------------- 从 HTTP 请求获取的数据 ----------------------------

    /** 实时天气 */
    now: {} as WeatherNow,

    /** 逐日天气预报 */
    daily: [] as WeatherDaily[],

    /** 今天和明天2天的逐日天气预报 */
    f2d: [] as WeatherDaily[],

    /** 逐小时天气预报 */
    hourly: [] as WeatherHourly[],

    /** 分钟级降水 */
    rain: {} as MinutelyRain,

    /** 实时空气质量 */
    airNow: {} as AirNow,

    /** 天气预警 */
    warnings: [] as WarningNow[],

    /** 用于展示的地点名称 */
    locationName: '正在获取定位 ...',

    /** 当前日期 */
    date: '',

    // ------------------------ 从 HTTP 请求获取二次处理后的数据 -----------------------

    /** 未来15天预报的温度条 */
    tempBars: [] as TempBar[],

    // -------------------------------- 页面状态数据 --------------------------------

    /** 页面装载完成 */
    loaded: false,

    // -------------------------------- 其他页面数据 --------------------------------

    /** 地理位置栏与顶部的闲置高度，单位：px */
    reservedHeight: 80,

    /** 图标颜色，跟时钟对应，白天为黑色，晚上为白色 */
    iconColor: CommonColor.BLACK,

    /** 当前选中的天气地点 ID */
    currentPlaceId: '',

    f24Canvas: {} as CanvasRenderingContext2D,
  },

  behaviors: [themeBehavior, shareAppBehavior],

  async onReady() {
    this.setReservedHeight()

    await this.init()
    this.setData({loaded: true})
  },

  // 从其他页面返回时，判断下是否切换了地点，如果切换了则重新请求数据
  onShow() {
    if (this.data.loaded) {
      const selectedWeatherPlaceId = getSelectWeatherPlaceId()
      if (this.data.currentPlaceId !== selectedWeatherPlaceId) {
        this.init()
      }
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init().then(() => {
      wx.stopPullDownRefresh().then(() => {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
        })
      })
    })
  },

  /** 页面初始化 */
  async init() {
    await wx.showLoading({title: '数据加载中', mask: true})

    let weatherData: WeatherData

    const selectedWeatherPlaceId = getSelectWeatherPlaceId()
    this.setData({currentPlaceId: selectedWeatherPlaceId})

    if (selectedWeatherPlaceId) {
      weatherData = await getWeatherDataByPlaceId(selectedWeatherPlaceId)
    } else {
      weatherData = await getWeatherDataAnonymous()
    }

    // 备注（2022.11.05）
    // 此处是偷懒的写法，应该将字段值一个个取出来，然后再赋值
    this.setData(weatherData)

    await wx.hideLoading()

    await this.afterGettingData()
  },

  /** 获取并设置保留高度，只需在初始化时执行一次即可 */
  setReservedHeight() {
    const rect = wx.getMenuButtonBoundingClientRect()
    this.setData({reservedHeight: rect.top - 4})
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
    drawWeatherHourlyLineChart(ctx, this.data.hourly, theme)
  },

  /**
   * 跳转到“天气地点”页
   */
  goToWeatherPlacePage() {
    wx.navigateTo({url: '/pages/weather/place/place'})
  },

  /**
   * 跳转到“逐日天气预报”详情页
   */
  goToWeatherDailyPage(e: WechatMiniprogram.CustomEvent<any, any, {date: string}>) {
    const {daily, locationName} = this.data
    const date = e.currentTarget.dataset.date

    wx.navigateTo({
      url: '/pages/weather/daily/daily',
    }).then((res) => {
      res.eventChannel.emit(PageChannelEvent.DATA_TRANSFER, {daily, date, locationName})
    })
  },
})
