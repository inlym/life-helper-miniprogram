import {
  addWeatherPlace,
  deleteWeatherPlace,
  getSelectWeatherPlaceId,
  getWeatherPlaceList,
  IpLocatedPlace,
  removeSelectWeatherPlaceId,
  setSelectWeatherPlaceId,
  WeatherPlace,
} from '../../../app/services/weather-place'
import {themeBehavior} from '../../../behaviors/theme-behavior'
import {CommonColor} from '../../../app/core/constant'
import {TapEvent} from '../../../app/utils/types'

Page({
  data: {
    // ---------------------------  从 HTTP 请求获取的数据  ---------------------------

    /** 天气地点列表 */
    list: [] as WeatherPlace[],

    /** IP 定位地点 */
    ipLocated: {} as IpLocatedPlace,

    // -------------------------------- 页面状态数据 --------------------------------

    /** 页面是否加载完毕 */
    loaded: false,

    /** 当前选中的天气地点 ID */
    selectedId: '',

    /** 当前是否为编辑状态 */
    isEdit: false,
  },

  behaviors: [themeBehavior],

  onLoad() {
    this.init()
  },

  /** 页面初始化方法 */
  async init() {
    const {list, ipLocated} = await getWeatherPlaceList()
    const selectedId = getSelectWeatherPlaceId()
    this.setData({list, ipLocated, selectedId, loaded: true})
  },

  /** 跳回首页 */
  goToIndexPage() {
    wx.switchTab({url: '/pages/index/index'})
  },

  /** 绑定添加天气地点事件 */
  async add() {
    try {
      const result = await wx.chooseLocation({})

      // 发起添加天气地点请求
      const place = await addWeatherPlace(result)

      // 将新增的地点设为活跃项
      setSelectWeatherPlaceId(place.id)

      // 提示添加成功
      wx.showToast({
        title: '添加成功',
        icon: 'success',
      })

      // 1秒后自动跳走
      setTimeout(() => {
        this.goToIndexPage()
      }, 1000)
    } catch (e) {
      // 备注（2022.11.04）
      // 直接点“取消”则会报错进入此处，这种情况不需要处理
    }
  },

  /** 删除一个天气地点 */
  async remove(id: string) {
    // 当前操作的天气地点
    const place = this.data.list.find((item) => item.id === id)

    // “删除”操作二次确认
    const result = await wx.showModal({
      title: '提示',
      content: `是否确认不再关注 ${place?.name} 的天气？`,
      cancelText: '继续关注',
      confirmText: '不再关注',
      confirmColor: CommonColor.RED,
    })

    // 点了“确认”才继续
    if (result.confirm) {
      const deletedPlace = await deleteWeatherPlace(id)

      // 如果被删除的是当前选中的，则清除
      if (this.data.selectedId === deletedPlace.id) {
        removeSelectWeatherPlaceId()
      }

      // 从列表中删除该项（纯客户端处理）
      const list = this.data.list
      const index = list.findIndex((item) => item.id === deletedPlace.id)
      list.splice(index, 1)
      this.setData({list})

      // 提示删除成功
      await wx.showToast({
        title: '删除成功',
        icon: 'success',
      })
    }
  },

  /** 变更“编辑”状态 */
  switchEdit() {
    const isEdit = this.data.isEdit
    this.setData({isEdit: !isEdit})
  },

  /** 处理 IP 定位栏点击事件 */
  handleIpLocatedItemTap() {
    removeSelectWeatherPlaceId()
    this.goToIndexPage()
  },

  /** 处理“删除”按钮点击事件 */
  handleRemoveButtonTap(e: TapEvent<{id: string}>) {
    const placeId = e.currentTarget.dataset.id
    this.remove(placeId)
  },

  /** 处理天气地点列表项点击事件 */
  handleWeatherPlaceItemTap(e: TapEvent<{id: string}>) {
    const placeId = e.currentTarget.dataset.id

    // 不在“编辑”状态才继续
    if (!this.data.isEdit) {
      setSelectWeatherPlaceId(placeId)
      this.goToIndexPage()
    }
  },
})
