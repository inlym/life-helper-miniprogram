'use strict'

const app = getApp()
const { CustomPage } = app
const drawForecast15DaysLine = require('../../app/canvas/forecast15DaysLine.js')
const drawForecast24HoursLine = require('../../app/canvas/forecast24HoursLine.js')

CustomPage({
  /** 页面的初始数据 */
  data: {
    /** 实时天气情况 */
    weatherCondition: {
      temperature: '0',
      address: '正在定位中 ...',
    },

    /** 未来 15 天的天气预报折线图的 canvas 画笔 */
    ctxFore15Line: null,

    /** 未来 15 天的天气预报折线图的 canvas  */
    canvasFore15Line: null,

    /** 未来 24 小时天气预报折线图的 canvas 画笔 */
    ctxFore24hoursline: null,

    /** 未来 24 小时天气预报折线图的 canvas  */
    canvasFore24hoursline: null,

    /** Toptips顶部错误提示组件 */
    toptips: {
      type: 'success',
      show: false,
      msg: '',
      delay: 1000,
    },

    /** 半屏弹窗组件 */
    halfScreen: {
      show: false,
      title: '',
      subTitle: '',
      desc: '',
      tips: '',
    },
  },

  requested: {
    weatherCondition: {
      url: '/weather/now',
    },

    liveIndex: {
      url: '/weather/liveindex',
    },

    forecast15Days: {
      url: '/weather/forecast15days',
      ignore: 'onLoad',
      handler(res, self) {
        drawForecast15DaysLine(self.data.ctxFore15Line, res.maxTemperature, res.minTemperature)
      },
    },

    forecast24Hours: {
      url: '/weather/forecast24hours',
      ignore: 'onLoad',
      handler(res, self) {
        drawForecast24HoursLine(self.data.ctxFore24hoursline, res.list)
      },
    },
  },

  debug: true,

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    wx.createSelectorQuery()
      .select('#fore15line')
      .fields({
        node: true,
        size: true,
      })
      .exec(async (res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        canvas.width = 1920
        canvas.height = 300

        this.setData({
          ctxFore15Line: ctx,
          canvasFore15Line: canvas,
        })

        this.bindRequestData('forecast15Days', '/weather/forecast15days').then((res2) => {
          drawForecast15DaysLine(ctx, res2.maxTemperature, res2.minTemperature)
        })
      })

    wx.createSelectorQuery()
      .select('#fore24hoursline')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        canvas.width = 2600
        canvas.height = 300

        this.setData({
          ctxFore24hoursline: ctx,
          canvasFore24hoursline: canvas,
        })

        this.bindRequestData('forecast24Hours', '/weather/forecast24hours').then((res2) => {
          drawForecast24HoursLine(ctx, res2.list)
        })
      })
  },

  /** 生命周期函数--监听页面显示 */
  onShow() {},

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
   * @param {string} stage 页面阶段，目前为以下值：'onLoad', 'onPullDownRefresh', 'onResetLocation'
   */
  _init(stage) {
    if (stage === 'onPullDownRefresh') {
      setTimeout(() => {
        wx.stopPullDownRefresh()
        this.showUpdateTips('哇哦 ~ 数据已经更新了哦！')
      }, 1000)
    }

    if (stage === 'onResetLocation') {
      this.showUpdateTips('已经切换至新的地点')
    }
  },

  _query() {
    const location = app.read(app.keys.KEY_CHOOSE_LOCATION)

    if (location) {
      const { province, city, district, latitude, longitude, name, address } = location
      return {
        province,
        city,
        district,
        latitude,
        longitude,
        name,
        address,
      }
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
    const authRes = await app.authorize('scope.userLocation')
    if (authRes) {
      wx.chooseLocation({
        success(res) {
          if (res) {
            app.write(app.keys.KEY_CHOOSE_LOCATION, res)
            self._init('onResetLocation')
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
        delay: 1000,
        msg: content,
      },
    })
  },
})
