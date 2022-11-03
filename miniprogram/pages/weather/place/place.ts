import {StorageField} from '../../../app/core/constant'
import {enhancedStorage} from '../../../app/core/storage'
import {WeatherNow} from '../../../app/services/weather-data.interface'
import {addWeatherPlace, getWeatherPlaces, removeWeatherPlace} from '../../../app/services/weather-place'
import {WeatherPlace} from '../../../app/services/weather-place.interface'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    // -----------------------------  从上个页面带来的数据  -----------------------------

    /** IP 定位获取的位置 */
    ipLocationName: '',

    /** 当前选中的天气地点 ID */
    currentPlaceId: 0,

    /** 通过 IP 定位获取的实时天气 */
    ipLocatedWeatherNow: {} as WeatherNow,

    // ---------------------------  从 HTTP 请求获取的数据  ---------------------------

    /** 天气地点列表 */
    places: [] as WeatherPlace[],

    // -------------------------------- 其他页面数据 --------------------------------

    /** 当前是否为编辑状态 */
    isEdit: false,
  },

  behaviors: [themeBehavior],

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('transferData', (data) => {
      this.setData(data)
    })

    this.getWeatherPlaces()
  },

  /** 变更“编辑”状态 */
  switchEdit() {
    const isEdit = this.data.isEdit
    this.setData({isEdit: !isEdit})
  },

  /** 获取天气地点列表 */
  async getWeatherPlaces(): Promise<void> {
    const list = await getWeatherPlaces()
    this.setData({places: list})
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

        this.setData({places: list})

        await wx.showToast({icon: 'none', title: '添加成功，已为您展示该地点的天气'})
        this.switchPlace(place.id)
      } else {
        await wx.showModal({
          content: '您未选择地点！',
        })
      }
    }
  },

  /** 移除一个关注地点 */
  async removePlace(event: any) {
    const id: number = event.currentTarget.dataset.id

    if (id === this.data.currentPlaceId) {
      await wx.showModal({
        title: '提示',
        content: '当前已选中该地点，请切换至其他地点后再操作删除！',
        showCancel: false,
        confirmText: '我知道了',
      })
    } else {
      const places = this.data.places

      const place: WeatherPlace = places.find((item: WeatherPlace) => item.id === id)!

      const res = await wx.showModal({
        title: '提示',
        content: `是否不再关注 ${place.name} 的天气？`,
        confirmText: '不再关注',
        confirmColor: '#fa5151',
      })

      if (res.confirm) {
        removeWeatherPlace(id)
        const index = places.findIndex((item) => item.id === id)
        places.splice(index, 1)
        this.setData({places})

        wx.showToast({title: '删除成功', icon: 'success'})
      }
    }
  },

  /** 切换要查看天气的地点，并返回上一页 */
  switchPlace(placeId: number) {
    enhancedStorage.set(StorageField.SELECTED_WEATHER_PLACE_ID, placeId)
    this.setData({currentPlaceId: placeId})
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('switchPlace', {currentPlaceId: placeId})
    wx.navigateBack()
  },

  /** 处理地点列表项点击事件 */
  handleItemTap(event: any) {
    if (!this.data.isEdit) {
      const id: number = event.currentTarget.dataset.id

      this.switchPlace(id)
    }
  },
})
