'use strict'

const app = getApp()
const { CustomPage } = app
const drawForecast15DaysLine = require('../../app/canvas/forecast15DaysLine.js')
const { getCanvas } = require('../../app/core/canvas.js')

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
    iconPrefix: '/images/weather_icon/one/',
  },

  requested: {
    address: {
      url: '/location/address',
      ignore: ['afterChooseLocation', 'onLoad', 'onPullDownRefresh'],
      queries: 'qs',
    },

    condition: {
      url: '/weather/now',
      queries: 'qs',
      ignore: 'onLoad',
    },

    forecast2Days: {
      url: '/weather/forecast2days',
      queries: 'qs',
      ignore: 'onLoad',
    },

    liveIndex: {
      url: '/weather/liveindex',
      queries: 'qs',
      ignore: 'onLoad',
    },

    forecast24Hours: {
      url: '/weather/forecast24hours',
      ignore: 'onLoad',
      queries: 'qs',
    },

    airNow: {
      url: '/weather/airnow',
      ignore: 'onLoad',
      queries: 'qs',
    },

    forecast15Days: {
      url: '/weather/forecast15days',
      ignore: 'onLoad',
      handler(res, _this) {
        getCanvas.call(_this, 'fore15line').then((res2) => {
          drawForecast15DaysLine(res2.ctx, res.maxTemperature, res.minTemperature)
        })
      },
      queries: 'qs',
    },
  },

  /** 查询字符串处理函数 */
  qs() {
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

      this.logger.debug('[onLoad] res', res)
      this.logger.debug('[onLoad] this.qs()', this.qs())

      this.bindResponseData('address', '/location/address', this.qs())
      this.bindResponseData('forecast2Days', '/weather/forecast2days', this.qs())
      this.bindResponseData('forecast24Hours', '/weather/forecast24hours', this.qs())
      this.bindResponseData('condition', '/weather/now', this.qs())
      this.bindResponseData('liveIndex', '/weather/liveindex', this.qs())
      this.bindResponseData('airNow', '/weather/airnow', this.qs())
    })
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    app.location.getLocation().then((res) => {
      if (res) {
        this.pushLocation(res)
      }

      this.logger.debug('[onReady] res', res)
      this.logger.debug('[onReady] this.qs()', this.qs())

      const promisesFor15Days = []
      promisesFor15Days.push(getCanvas.call(this, 'fore15line', 1920, 300))
      promisesFor15Days.push(
        this.bindResponseData('forecast15Days', '/weather/forecast15days', this.qs())
      )
      Promise.all(promisesFor15Days).then((res2) => {
        const { ctx } = res2[0]
        const { maxTemperature, minTemperature } = res2[1]
        drawForecast15DaysLine(ctx, maxTemperature, minTemperature)
      })
    })
  },

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
          if (res) {
            self.pushLocation(res, 'choose')
            self.setData({
              address: {
                address: res.name,
              },
            })
            self.init('afterChooseLocation')
          }
        },
      })
    }
  },

  /**
   * 使用 toptips 显示更新提示，除了 onLoad 时不显示，其余更新操作均展示
   */
  showUpdateTips(content) {
    this.setData({
      toptips: {
        type: 'success',
        show: true,
        delay: 2000,
        msg: content,
      },
    })
  },
})
