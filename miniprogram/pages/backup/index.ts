import {drawWeatherDailyLineChart} from '../../app/services/weather-canvas'
import {getMixedWeatherDataAnonymous, getMixedWeatherDataByPlaceId} from '../../app/services/weather-data'
import {
  AirDaily,
  AirNow,
  CurrentLocationWeather,
  F2dItem,
  IndicesItem,
  MinutelyRain,
  WeatherDailyItem,
  WeatherHourlyItem,
  WeatherNow,
} from '../../app/services/weather-data.interface'
import {addWeatherPlace, getWeatherPlaces, removeWeatherPlace} from '../../app/services/weather-place'
import {WeatherPlace} from '../../app/services/weather-place.interface'
import {createCanvasContext} from '../../app/utils/canvas'
import {BaseEvent, CustomEvent} from '../../app/utils/wx-typings'

interface ActionsheetGroup {
  text: string

  value: number
}

interface ActionSheetItemTapDetail {
  index: number

  value: number
}

Page({
  data: {
    // 天气数据
    air5d: [] as AirDaily[],
    airNow: {} as AirNow,
    f15d: [] as WeatherDailyItem[],
    f24h: [] as WeatherHourlyItem[],
    indices3d: [] as IndicesItem[],
    now: {} as WeatherNow,
    rain: {} as MinutelyRain,
    place: {} as WeatherPlace,

    f2d: [] as F2dItem[],
    currentLocationWeather: {} as CurrentLocationWeather,

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

    /** 是否展示底部弹起的操作按钮组件 */
    showActionsheet: false,

    actionsheetGroups: [] as ActionsheetGroup[],

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
    this.setData({currentPlaceId: placeId})
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

  /** 添加新的关注城市 */
  async addNewPlace() {
    // 目前设定只允许添加 5 个
    if (this.data.places.length >= 5) {
      await wx.showModal({
        title: '提示',
        content: '目前仅支持添加5个地点，如需添加，请先删除其他地点！',
        showCancel: false,
        confirmText: '确定',
      })
    } else {
      const result = await wx.chooseLocation({})
      if (result.name) {
        const place = await addWeatherPlace(result)
        const list = this.data.places
        list.unshift(place)

        this.setData({
          places: list,
          currentPlaceId: place.id,
          showPageContainer: false,
        })

        await wx.showToast({icon: 'none', title: '添加成功，已为您展示该地点的天气'})
        this.getWeatherDataByPlaceId(place.id)
      } else {
        await wx.showModal({
          content: '您未选择地点！',
        })
      }
    }
  },

  processActionsheetGroups() {
    const groups: ActionsheetGroup[] = this.data.places.map((item) => {
      const text = item.name
      const value = item.id
      return {text, value}
    })

    this.setData({actionsheetGroups: groups})
  },

  /** 编辑天气地点列表 */
  async editPlaceList() {
    this.processActionsheetGroups()
    this.setData({showActionsheet: true})
  },

  /** 处理弹出框点击 */
  async handleActionsheetItemTap(e: CustomEvent<ActionSheetItemTapDetail>) {
    const placeId = e.detail.value
    const index = e.detail.index
    console.log(index)
    if (placeId === this.data.currentPlaceId) {
      await wx.showModal({
        title: '提示',
        content: '当前地点已选中展示，请先切换为其他地点后再操作删除！',
        showCancel: false,
      })
    } else {
      const list = this.data.places
      list.splice(index, 1)
      this.setData({places: list, showActionsheet: false})
      await removeWeatherPlace(placeId)
      await wx.showToast({icon: 'success', title: '删除成功'})
    }
  },
})
