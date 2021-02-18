'use strict'

const app = getApp()

Page({
  /** 页面的初始数据 */
  data: {
    /** 实时天气情况 */
    weatherCondition: {
      temperature: '0',
      location: '正在定位中 ...',
    },

    /** 未来 15 天的天气预报 */
    forecastList: [],

    /** 未来 15 天的天气预报的最高温度列表 */
    maxTemperature: [],

    /** 未来 15 天的天气预报的最低温度列表 */
    minTemperature: [],

    /** 未来 15 天的天气预报折线图的 canvas 画笔 */
    ctxFore15Line: null,

    /** Toptips顶部错误提示组件 */
    toptip: {
      type: 'success',
      show: false,
      msg: '',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {
    this.init()
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    const query = wx.createSelectorQuery()
    query
      .select('#fore15line')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        canvas.width = 1920
        canvas.height = 300

        this.setData({
          ctxFore15Line: ctx,
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
    this.init()
    setTimeout(() => {
      wx.stopPullDownRefresh()
      this.setData({
        toptip: {
          type: 'success',
          show: true,
          msg: '哇哦！已经更新了哦 ~',
        },
      })
    }, 1000)
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

  /** 页面初始化 */
  init() {
    this.getWeatherCondition()
    this.getForecast15days()
  },

  /** 获取天气实况 */
  async getWeatherCondition() {
    const res = await app.get('/weather/now')
    this.setData({
      weatherCondition: res.data,
    })
  },

  /** 获取未来 15 天的天气预报 */
  async getForecast15days() {
    const res = await app.get('/weather/forecast15days')
    this.setData({
      forecastList: res.data.list,
      maxTemperature: res.data.maxTemperature,
      minTemperature: res.data.minTemperature,
    })

    this.render15Line(this.data.ctxFore15Line, res.data.maxTemperature, res.data.minTemperature)
  },

  /**
   * 渲染 15 天预报的折线图
   * @param {*} ctx 画笔
   * @param {number[]} maxList 最高温度值列表
   * @param {number[]} minList 最低温度值列表
   */
  render15Line(ctx, maxList, minList) {
    const width = 1920
    const height = 300
    const days = 16

    // 获取最大温度数值
    let max = -999
    for (let i = 0; i < maxList.length; i++) {
      max = maxList[i] > max ? maxList[i] : max
    }

    // 获取最小温度数值
    let min = 999
    for (let i = 0; i < minList.length; i++) {
      min = minList[i] < min ? minList[i] : min
    }

    /** 画布高度上下留白占比 */
    const space = 0.1

    /** 每摄氏度温度值所占的高度 */
    const hUnit = Math.floor((height * (1 - space * 2)) / (max - min))

    /** 一个为一个格子，计算每个格子的宽度 */
    const wUnit = width / days

    /** 计算最高温度值折线的坐标 */
    const maxCoordinate = []
    for (let i = 0; i < maxList.length; i++) {
      const x = wUnit * (0.5 + i)
      const y = height * space + (max - maxList[i]) * hUnit
      maxCoordinate.push({
        x,
        y,
      })
    }

    /** 计算最低温度值折线的坐标 */
    const minCoordinate = []
    for (let i = 0; i < minList.length; i++) {
      const x = wUnit * (0.5 + i)
      const y = height * space + (max - minList[i]) * hUnit
      minCoordinate.push({
        x,
        y,
      })
    }

    /** 给第2个格子（今天）画个背景色 */
    ctx.fillStyle = '#eaeaea'
    ctx.fillRect(wUnit, -100, wUnit, height * 3)

    /** 画最高温度折线 */
    ctx.beginPath()
    for (let i = 0; i < maxCoordinate.length; i++) {
      const { x, y } = maxCoordinate[i]
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = '#D54476'
    ctx.lineWidth = 5
    ctx.stroke()

    /** 画最低温度折线 */
    ctx.beginPath()
    for (let i = 0; i < minCoordinate.length; i++) {
      const { x, y } = minCoordinate[i]
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = '#5253D7'
    ctx.lineWidth = 5
    ctx.stroke()

    // 画最高温度折线上的圆圈
    for (let i = 0; i < maxCoordinate.length; i++) {
      ctx.beginPath()
      const { x, y } = maxCoordinate[i]
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.strokeStyle = '#D54476'
      ctx.lineWidth = 10
      ctx.stroke()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
    }

    // 画最低温度折线上的圆圈
    for (let i = 0; i < minCoordinate.length; i++) {
      ctx.beginPath()
      const { x, y } = minCoordinate[i]
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.strokeStyle = '#5253D7'
      ctx.lineWidth = 10
      ctx.stroke()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
    }
  },
})
