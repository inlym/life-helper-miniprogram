'use strict'

const { CustomPage } = getApp()
const { addWeatherCity } = require('../../app/services/weather')

CustomPage({
  onLoad() {
    console.log(this.query())
    console.log(this.query('id'))
  },

  async one() {
    const scope = 'scope.userLocation'
  },

  requested: {
    myData: {
      url: '/debug',
      params(query) {
        return { id: query.id }
      },
      handler(key, data) {
        console.log('key: ', key)
        console.log('data: ', data)
      },
    },
  },

  async two() {
    const modalResult = await wx.showModal({
      title: '系统提示',
      content: '为保证功能正常使用，需要您开启相应权限！',
      confirmText: '去设置',
      cancelText: '我不想用',
    })
    console.log(modalResult)
  },

  async three() {
    const result = await wx.openSetting()
    console.log('result: ', result)
  },

  four() {
    console.log('-- 触发成功事件 --')
  },

  five() {
    console.log('-- 触发失败事件 --')
  },

  six() {
    console.log('-- addWeatherCity --')
    addWeatherCity()
  },

  seven() {
    this.request({
      mock: {
        data: {
          message: {
            type: 0,
            title: '哈哈这是消息哦！',
          },
        },
      },
    })
  },
})
