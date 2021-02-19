'use strict'

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
    toptip: {
      type: 'success',
      show: false,
      msg: '',
    },

    /** 半屏弹窗组件 */
    halfScreen: {
      show: false,
      title: '我是标题',
      subTitle: '我是副标题',
      desc: '辅助操作描述内容',
      tips: '辅助操作提示内容',
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

        app.get('/weather/forecast15days').then((res2) => {
          this.setData({
            forecastList: res2.data.list,
          })
          drawForecast15DaysLine(ctx, res2.data.maxTemperature, res2.data.minTemperature)
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

        app.get('/weather/forecast24hours').then((res2) => {
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
  onShow() {},

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    this.init('onPullDownRefresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
      this.setData({
        toptip: {
          type: 'success',
          show: true,
          msg: '哇哦！已经更新了哦 ~',
        },
      })
    }, 500)
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
   * @param {string} stage 页面阶段，目前为两个值：'onLoad', 'onPullDownRefresh'
   */
  init(stage) {
    /** 天气实况 */
    app.bindData(this, 'weatherCondition', '/weather/now')

    /** 生活指数 */
    app.bindData(this, 'liveIndex', '/weather/liveindex')

    if (stage === 'onPullDownRefresh') {
      this.getForecast15days()
      this.getForecast24hours()
    }
  },

  /** 获取未来 15 天的天气预报 */
  async getForecast15days() {
    const res = await app.get('/weather/forecast15days')
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
    const res = await app.get('/weather/forecast24hours')
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
})
