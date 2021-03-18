'use strict'

const app = getApp()
const { CustomPage } = app
const { chooseLocation } = require('../../app/common/location.js')

CustomPage({
  /** 页面的初始数据 */
  data: {
    /** 实时天气情况 */
    condition: {
      temperature: '0',
    },

    address: {
      address: '正在定位中 ...',
    },

    /** 定位信息，每次定位 push 一个新对象 */
    _location: [],

    /** 半屏弹窗组件 */
    halfScreen: {
      show: false,
      title: '',
      subTitle: '',
      desc: '',
      tips: '',
    },

    /** 天气图片地址前缀 */
    iconPrefix: '/images/weather/one/',
  },

  requested: {
    address: {
      url: '/location/address',
      ignore: ['afterChooseLocation', 'onPullDownRefresh'],
      queries: 'qs1',
    },

    now: {
      url: '/weather/now2',
      queries: 'qs1',
    },

    forecast2Days: {
      url: '/weather/forecast2days',
      queries: 'qs1',
    },

    liveIndex: {
      url: '/weather/liveindex',
      queries: 'qs1',
    },

    forecast24Hours: {
      url: '/weather/forecast24hours',
      queries: 'qs1',
    },

    minutelyRain: {
      url: '/weather/rain',
      queries: 'qs1',
    },

    airNow: {
      url: '/weather/airnow',
      queries: 'qs1',
    },

    fore7d: {
      url: '/weather/7d',
      queries: 'qs1',
    },
  },

  computed: {
    fore2dList(data) {
      const { list } = data.fore7d
      if (!list) {
        return []
      }
      const result = []
      for (let i = 0; i < list.length; i++) {
        if (list[i]['weekday'] === '今天') {
          result.push(list[i])
          result.push(list[i + 1])
        }
      }
      return result
    },
  },

  /** 查询字符串处理函数 */
  qs2() {
    const locationList = this.data._location
    if (locationList.length === 0) {
      return {}
    } else {
      const item = locationList[locationList.length - 1]
      const { longitude, latitude } = item
      return {
        location: `${longitude},${latitude}`,
      }
    }
  },

  qs1() {
    const location = this.read(this.config.keys.STORAGE_WEATHER_LOCATION)
    if (location) {
      const { longitude, latitude } = location
      return { location: `${longitude},${latitude}` }
    } else {
      return {}
    }
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** 生命周期函数--监听页面显示 */
  onShow() {
    /** 在该时间内（ 20 分钟）无需重新请求，单位：ms */
    const exp = 20 * 60 * 1000

    const locationList = this.data._location
    if (locationList.length === 0) {
      return
    }

    if (locationList.length > 0) {
      const lastTime = locationList[locationList.length - 1]['time']
      if (app.utils.nowMs() - lastTime < exp) {
        return
      }
    }

    app.location.getLocation().then((res) => {
      if (res) {
        this.pushLocation(res)
      }

      this.init('onShowGetNewLocation')
    })
  },

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {},

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /**
   * 页面初始化
   * @update 2021-02-19
   * @param {string} stage 页面阶段
   *
   * 当前页面 stage 包含以下值：
   * 1. 'onLoad' - 页面初始化
   * 2. 'onPullDownRefresh' - 页面下拉刷新
   * 3. 'afterChooseLocation' - 手工选择新的定位
   * 4. 'afterGetLocationSilently' - 静默获取新的当前定位
   * 5. 'onShowGetNewLocation' - 页面重新展示时，获取了新的定位
   */
  init(stage) {
    if (stage === 'afterChooseLocation') {
      wx.showToast({ title: '已经切换至新的地点', icon: 'none' })
    }

    if (stage === 'onShowGetNewLocation') {
      wx.showToast({ title: '已将定位切换成当前所在位置', icon: 'none' })
    }
  },

  /**
   * 点击「生活指数」模块单个按钮，使用半屏弹窗组件显示细节
   * @since 2021-02-19
   */
  showLiveIndexDetail(e) {
    /** 点击按钮的索引 */
    const { index } = e.currentTarget.dataset

    const detail = this.data.liveIndex.list[index]
    if (detail) {
      this.setData({
        halfScreen: {
          show: true,
          title: `${detail.name}指数`,
          desc: detail.status,
          tips: detail.description,
        },
      })
    }
  },

  /** 人工选择定位 */
  async chooseLocation() {
    const res = await chooseLocation()
    if (res) {
      this.write(this.config.keys.STORAGE_WEATHER_LOCATION, res)
      this.setData({ address: { address: res.name } })
      this.init('afterChooseLocation')
    }
  },

  /** 点击某一天的卡片，跳转 fore15d 页面对应日期 */
  handleDayItemTap(event) {
    const { date } = event.currentTarget.dataset
    this.transferData('fore15d')
    wx.navigateTo({ url: `/pages/weather/fore15d/index?transfer=fore15d&date=${date}` })
  },

  /** 未来 15 天逐天预报，点击其中一天 */
  handleFore15ItemTap(event) {
    const { date } = event.currentTarget.dataset
    this.transferData('fore15d')
    wx.navigateTo({ url: `/pages/weather/fore15d/index?transfer=fore15d&date=${date}` })
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
