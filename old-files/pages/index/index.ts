import { sharedInit } from '../../app/core/shared-init'
import { makeUrl } from '../../app/core/utils'
import { TapEvent } from '../../app/core/wx.interface'
import { ExtAirDailyForecastItem, ExtDailyForecastItem, ExtLivingIndexItem, ExtWeatherNow } from '../../app/models/weather.model'
import { addWeatherCity } from '../../app/services/weather-city.service'
import { getWeather } from '../../app/services/weather.service'

Page({
  /** 页面的初始数据 */
  data: {
    // 页面数据

    now: {} as ExtWeatherNow,

    /** 地点名称 */
    locationName: '',

    /** 当前选中的要查看天气的城市 */
    cityId: 0,

    f15d: [] as ExtDailyForecastItem[],

    cities: [],

    livingIndex: [] as ExtLivingIndexItem[],

    air5d: [] as ExtAirDailyForecastItem[],

    // 页面交互相关数据

    /** 是否展示页面容器 */
    isShowPageContainer: false,

    currentLocationId: 0,

    /** 临时数据，存储从城市列表选中的城市ID，以便发起请求 */
    selectedCityId: 0,

    /** 半屏弹窗组件 */
    halfScreen: {
      show: false,
      title: '',
      subTitle: '',
      desc: '',
      tips: '',
    },
  },

  /** 页面初始化 */
  async init(eventName?: string) {
    await sharedInit(eventName)

    const cityId = this.data.cityId !== 0 ? this.data.cityId : undefined
    const data = await getWeather(cityId)
    this.setData(data)

    this.bindAqi()
    this.setF2d(this.data.f15d)
  },

  onLoad() {
    this.init('onLoad')
  },

  onPullDownRefresh() {
    this.init('onPullDownRefresh')
  },

  /**
   * 获取未来 2 天预报数据
   *
   * @param f15d 未来 15 天预报数据
   */
  setF2d(f15d: ExtDailyForecastItem[]): void {
    const today = f15d.find((item: ExtDailyForecastItem) => item.dayText === '今天')
    const tomorrow = f15d.find((item: ExtDailyForecastItem) => item.dayText === '明天')
    const f2d = [today, tomorrow]
    this.setData({ f2d: f2d })
  },

  /**
   * 将未来 5 天空气质量预报绑定到未来 15 天天气预报中
   */
  bindAqi(): void {
    const f15d = this.data.f15d
    const air5d = this.data.air5d

    const list = f15d.map((item: ExtDailyForecastItem) => {
      item.aqi = air5d.find((airItem: ExtAirDailyForecastItem) => item.date === airItem.date)
      return item
    })

    this.setData({ f15d: list })
  },

  /**
   * 点击「生活指数」模块单个按钮，使用半屏弹窗组件显示细节
   * @since 2021-02-19
   */
  showLiveIndexDetail(e: TapEvent) {
    /** 点击按钮的索引 */
    const { index } = e.currentTarget.dataset

    const detail: any = this.data.livingIndex[index]
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
    const f15d = this.data.f15d
    wx.navigateTo({
      url: makeUrl('/pages/weather/f15d/f15d', { date }),
      success(res) {
        res.eventChannel.emit('data', f15d)
      },
    })
  },

  /** 添加天气城市 */
  async addCity() {
    const result = await addWeatherCity()

    if (typeof result !== 'undefined') {
      this.setData({
        cityId: result.id,
        isShowPageContainer: false,
      })

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
      cityId: id,
      isShowPageContainer: false,
    })

    this.init('afterSelectCity')
  },

  /** 监听用户点击页面内转发按钮 */
  onShareAppMessage() {
    return {
      title: '这个小程序很好用，推荐给你！',
      path: '/pages/index/index',
      imageUrl: 'https://static.lifehelper.com.cn/static/project/share.jpeg',
    }
  },
})
