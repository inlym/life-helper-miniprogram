'use strict'

const { CustomPage } = getApp()
const { addWeatherCity } = require('../../app/services/weather')

CustomPage({
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

    f2d: [],
  },

  requested: {
    main: {
      url: '/weather',
      handler(data) {
        const f2d = ['今天', '明天'].map((item) => data.f15d.find((day) => day.dayText === item))
        const currentLocationId = data.cities[0].locationId
        this.setData({ f2d, currentLocationId })
      },
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  /**
   * 点击「生活指数」模块单个按钮，使用半屏弹窗组件显示细节
   * @since 2021-02-19
   */
  showLiveIndexDetail(e) {
    /** 点击按钮的索引 */
    const { index } = e.currentTarget.dataset

    const detail = this.data.main.liveIndex[index]
    if (detail) {
      this.setData({
        halfScreen: {
          show: true,
          title: detail.name,
          desc: detail.category,
          tips: detail.text,
        },
      })
    }
  },

  /** 点击某一天的卡片，跳转 fore15d 页面对应日期 */
  handleDayItemTap(event) {
    console.log(event)
    const { date } = event.currentTarget.dataset
    const id = this.data.currentLocationId
    this.goTo('/pages/weather/f15d/f15d', { id, date }, { myData: { name: 'mark', age: 19 } })
  },

  handleHourItemTap() {},

  async addCity() {
    const result = await addWeatherCity()
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
})
