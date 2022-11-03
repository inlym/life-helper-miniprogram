import {
  addWeatherPlace,
  getSelectWeatherPlaceId,
  getWeatherPlaceList,
  IpLocatedPlace,
  setSelectWeatherPlaceId,
  WeatherPlace,
} from '../../../app/services/weather-place'
import {themeBehavior} from '../../../behaviors/theme-behavior'

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

    /** 当前选中的 ID */
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
        wx.switchTab({url: '/pages/index/index'})
      }, 1000)
    } catch (e) {
      // 备注（2022.11.04）
      // 直接点“取消”则会报错进入此处，这种情况不需要处理
    }
  },

  /** 变更“编辑”状态 */
  switchEdit() {
    const isEdit = this.data.isEdit
    this.setData({isEdit: !isEdit})
  },
})
