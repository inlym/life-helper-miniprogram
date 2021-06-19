'use strict'

const { CustomPage } = getApp()
const { chooseLocation } = require('../../app/services/location.js')

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
    main: {
      url: '/weather',
    },
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

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

  /** 人工选择定位 */
  async chooseLocation() {
    const res = await chooseLocation()
    if (res) {
      // 存入的经纬度保留到小数点后 5 位
      res.longitude = res.longitude.toFixed(5)
      res.latitude = res.latitude.toFixed(5)
      this.write(this.config.keys.STORAGE_WEATHER_LOCATION, res)
      this.setData({ address: { address: res.name } })
      this.init('afterChooseLocation')
    }
  },

  /** 点击某一天的卡片，跳转 fore15d 页面对应日期 */
  handleDayItemTap(event) {
    this.forward('/pages/weather/fore15d/fore15d', event)
  },

  /** 点击某一天的卡片，跳转 fore15d 页面对应日期 */
  handleHourItemTap(event) {
    this.forward(
      {
        url: '/pages/weather/fore24h/fore24h',
        transfer: 'fore24h',
      },
      event
    )
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
