'use strict'

const app = getApp()
const { CustomPage } = app
const drawForecast15DaysLine = require('../../app/canvas/forecast15DaysLine.js')
const drawForecast24HoursLine = require('../../app/canvas/forecast24HoursLine.js')
const { getCanvas } = require('../../app/core/canvas.js')

CustomPage({
  /** 页面的初始数据 */
  data: {
    /** 实时天气情况 */
    weatherCondition: {
      temperature: '0',
      address: '正在定位中 ...',
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
        drawForecast15DaysLine(self.data.ctx_fore15line, res.maxTemperature, res.minTemperature)
      },
    },

    forecast24Hours: {
      url: '/weather/forecast24hours',
      ignore: 'onLoad',
      handler(res, self) {
        drawForecast24HoursLine(self.data.ctx_fore24hoursline, res.list)
      },
    },
  },

  debug: true,

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    const promisesFor15Days = []
    promisesFor15Days.push(getCanvas.call(this, 'fore15line', { width: 1920, height: 300 }))
    promisesFor15Days.push(this.bindRequestData('forecast15Days', '/weather/forecast15days'))
    Promise.all(promisesFor15Days).then((res) => {
      const { ctx } = res[0]
      const { maxTemperature, minTemperature } = res[1]
      drawForecast15DaysLine(ctx, maxTemperature, minTemperature)
    })

    const promisesFor24Hours = []
    promisesFor24Hours.push(getCanvas.call(this, 'fore24hoursline', { width: 2600, height: 300 }))
    promisesFor24Hours.push(this.bindRequestData('forecast24Hours', '/weather/forecast24hours'))
    Promise.all(promisesFor24Hours).then((res) => {
      const { ctx } = res[0]
      const { list } = res[1]
      drawForecast24HoursLine(ctx, list)
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
    const authRes = await app.authorize.get('scope.userLocation')
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
    this.updateData({
      toptips: {
        type: 'success',
        show: true,
        delay: 1000,
        msg: content,
      },
    })
  },
})
