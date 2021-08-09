import { addWeatherCity } from '../../app-new/services/weather-city.service'
import { getWeather } from '../../app-new/services/weather.service'
import { goTo } from '../../app-new/core/route'
import { TapEvent } from '../../app-new/core/wx.interface'

Page({
  /** 页面的初始数据 */
  data: {
    /** 半屏弹窗组件 */
    halfScreen: {
      show: false,
      title: '',
      subTitle: '',
      desc: '',
      tips: '',
    },

    f15d: [],

    f2d: [],

    cities: [],

    liveIndex: [],

    /** 是否展示页面容器 */
    isShowPageContainer: false,

    currentLocationId: 0,

    /** 临时数据，存储从城市列表选中的城市ID，以便发起请求 */
    selectedCityId: 0,
  },

  onLoad() {
    this.init()
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    console.log(eventName)
    const data = await getWeather()
    this.setData(data)
  },

  /**
   * 点击「生活指数」模块单个按钮，使用半屏弹窗组件显示细节
   * @since 2021-02-19
   */
  showLiveIndexDetail(e: TapEvent) {
    /** 点击按钮的索引 */
    const { index } = e.currentTarget.dataset

    const detail: any = this.data.liveIndex[index]
    if (detail) {
      this.setData({
        halfScreen: {
          show: true,
          title: detail.name,
          subTitle: '',
          desc: detail.category,
          tips: detail.text,
        },
      })
    }
  },

  /** 点击某一天的卡片，跳转 fore15d 页面对应日期 */
  handleDayItemTap(event: TapEvent) {
    const { date } = event.currentTarget.dataset
    const id = this.data.currentLocationId
    goTo('/pages/weather/f15d/f15d', { id, date })
  },

  async addCity() {
    const result = await addWeatherCity()
    this.setData({
      selectedCityId: result!.id,
      isShowPageContainer: false,
    })

    if (result) {
      this.init('afterAddWeatherCity')
    }
  },

  /** 未来 2 小时降水量区域，点击顶部标题 */
  handleMinutelyRainTopTap() {
    wx.showModal({
      title: '说明',
      content: '每一个时间节点统计值为 10 分钟累积降水量，单位：mm',
      showCancel: false,
      confirmText: '我知道了',
    })
  },

  /** 页面容器进入前触发 */
  handleContainerEnter() {
    // 这个函数没有任何用途，但是这个事件不绑定方法，那么弹出容器时将无过渡效果
  },

  /** 页面容器离开后触发 */
  handlerContainerLeave() {
    this.setData({
      isShowPageContainer: false,
    })
  },

  /** 打开页面容器 */
  showPageContainer() {
    this.setData({
      isShowPageContainer: true,
    })
  },

  /** 关闭页面容器 */
  closePageContainer() {
    this.setData({
      isShowPageContainer: false,
    })
  },

  /** 选择城市后触发，以新的城市初始化 */
  selectCity(event: TapEvent) {
    const { id } = event.currentTarget.dataset
    this.setData({
      selectedCityId: id,
      isShowPageContainer: false,
    })
    this.init('afterSelectCity')
  },
})
