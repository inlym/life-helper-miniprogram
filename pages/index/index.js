'use strict'

const app = getApp()
const { CustomPage } = app

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
      ignore: ['afterChooseLocation', 'onLoad', 'onPullDownRefresh'],
      queries: 'qs1',
    },

    condition: {
      url: '/weather/now',
      queries: 'qs1',
      ignore: 'onLoad',
    },

    forecast2Days: {
      url: '/weather/forecast2days',
      queries: 'qs1',
      ignore: 'onLoad',
    },

    liveIndex: {
      url: '/weather/liveindex',
      queries: 'qs1',
      ignore: 'onLoad',
    },

    forecast24Hours: {
      url: '/weather/forecast24hours',
      ignore: 'onLoad',
      queries: 'qs1',
    },

    minutelyRain: {
      url: '/weather/rain',
      ignore: 'onLoad',
      queries: 'qs1',
    },

    airNow: {
      url: '/weather/airnow',
      ignore: 'onLoad',
      queries: 'qs1',
    },

    fore15d: {
      url: '/weather/15d',
      ignore: 'onLoad',
      queries: 'qs1',
    },
  },

  /** 查询字符串处理函数 */
  qs1() {
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

  pushLocation(location, mode = 'get') {
    const { longitude, latitude } = location
    const locationList = this.data._location
    locationList.push({
      longitude,
      latitude,
      mode,
      time: app.utils.nowMs(),
    })
    this.setData({
      _location: locationList,
    })
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    app.location.getLocation().then((res) => {
      if (res) {
        this.pushLocation(res)
      }

      this.pull('address')
      this.pull('forecast2Days')
      this.pull('forecast24Hours')
      this.pull('condition')
      this.pull('liveIndex')
      this.pull('airNow')
      this.pull('minutelyRain')
      this.pull('fore15d')
    })
  },

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
    const self = this
    const authRes = await app.authorize.get('scope.userLocation')
    if (authRes) {
      wx.chooseLocation({
        success(res) {
          console.log('chooseLocation', res)
          if (res) {
            self.pushLocation(res, 'choose')
            self.setData({
              address: {
                address: res.name,
              },
            })
            self.request({
              method: 'post',
              url: '/location/choose',
              data: res,
            })
            self.init('afterChooseLocation')
          }
        },
      })
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
