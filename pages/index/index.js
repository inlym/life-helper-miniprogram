'use strict'

const chooseLocation = requirePlugin('chooseLocation')
const app = getApp()
const drawForecast15DaysLine = require('../../app/canvas/forecast15DaysLine.js')
const drawForecast24HoursLine = require('../../app/canvas/forecast24HoursLine')

Page({
  /** 页面的初始数据 */
  data: {
    /** 实时天气情况 */
    weatherCondition: {
      temperature: '0',
      address: '正在定位中 ...',
    },

    /** 未来 15 天的天气预报 */
    forecastList: [],

    /** 未来 24 小时天气预报 */
    forecast24hoursList: [],

    /** 未来 24 小时天气预报的最高温 */
    forecast24HoursMaxTemp: '',

    /** 未来 24 小时天气预报的最低温 */
    forecast24HoursMinTemp: '',

    /** 未来 15 天的天气预报折线图的 canvas 画笔 */
    ctxFore15Line: null,

    /** 未来 15 天的天气预报折线图的 canvas  */
    canvasFore15Line: null,

    /** 未来 24 小时天气预报折线图的 canvas 画笔 */
    ctxFore24hoursline: null,

    /** 未来 24 小时天气预报折线图的 canvas  */
    canvasFore24hoursline: null,

    /** 生活指数 */
    liveIndex: [],

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

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {
    this.init('onLoad')
  },

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

        app.bindData(this, 'forecastList', '/weather/forecast15days').then((res2) => {
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

        const params = this.queryHandler()

        app
          .request({
            url: '/weather/forecast24hours',
            params,
          })
          .then((res2) => {
            this.setData({
              forecast24hoursList: res2.data.list,
              forecast24HoursMaxTemp: res2.data.maxTemperature,
              forecast24HoursMinTemp: res2.data.minTemperature,
            })
            drawForecast24HoursLine(ctx, res2.data.list)
          })
      })
  },

  /** 生命周期函数--监听页面显示 */
  onShow() {
    // 从地图选点插件返回后，在页面的 onShow 生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation()
    if (location) {
      app.write('location', location)
      this.init('onResetLocation')
    }
  },

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null)
  },

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    this.init('onPullDownRefresh')
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** 用户点击右上角分享 */
  onShareAppMessage() {
    const imageUrl = 'https://img.lh.inlym.com/share/index_share.jpeg'
    const title = '[来自好友推荐] 好友评价：十分实用，页面也很好看，推荐给你'
    const path = '/pages/index/index'
    return {
      imageUrl,
      title,
      path,
    }
  },

  /** 用户点击右上角菜单“分享到朋友圈”按钮 */
  onShareTimeline() {
    const title = '[来自好友推荐] 好友评价：五星好评的智能生活助手'
    return {
      title,
    }
  },

  /**
   * 页面初始化
   * @update 2021-02-19
   * @param {string} stage 页面阶段，目前为以下值：'onLoad', 'onPullDownRefresh', 'onResetLocation'
   */
  init(stage) {
    /** 天气实况 */
    app.bindData(this, 'weatherCondition', '/weather/now')

    /** 生活指数 */
    app.bindData(this, 'liveIndex', '/weather/liveindex')

    if (stage !== 'onLoad') {
      this.getForecast15days()
      this.getForecast24hours()
    }

    if (stage === 'onPullDownRefresh') {
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 1000)
      this.showUpdateTips('哇哦 ~ 数据已经更新了哦！')
    }

    if (stage === 'onResetLocation') {
      this.showUpdateTips('已经切换至新的地点')
    }
  },

  queryHandler() {
    const location = app.cache.get('location')

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
    } else {
      return ''
    }
  },

  /** 获取未来 15 天的天气预报 */
  async getForecast15days() {
    const self = this
    const res = await app.request({ url: '/weather/forecast15days', params: self.queryHandler() })
    this.setData({
      forecastList: res.data.list,
    })

    drawForecast15DaysLine(
      this.data.ctxFore15Line,
      res.data.maxTemperature,
      res.data.minTemperature
    )
  },

  /**
   * 获取未来 24 小时天气预报
   * @since 2021-02-19
   */
  async getForecast24hours() {
    const self = this
    const res = await app.request({ url: '/weather/forecast24hours', params: self.queryHandler() })
    this.setData({
      forecast24hoursList: res.data.list,
      forecast24HoursMaxTemp: res.data.maxTemperature,
      forecast24HoursMinTemp: res.data.minTemperature,
    })

    drawForecast24HoursLine(this.data.ctxFore24hoursline, res.data.list)
  },

  /**
   * 点击「生活指数」模块单个按钮，使用半屏弹窗组件显示细节
   * @since 2021-02-19
   */
  showLiveIndexDetail(e) {
    /** 点击按钮的索引 */
    const { index } = e.currentTarget.dataset

    const detail = this.data.liveIndex[index]
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

  /**
   * 点击地址栏区域，跳转地图选点插件
   * @since 2021-02-20
   */
  getLocation() {
    const { key, referer } = app.config.locationPicker
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`,
    })
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
