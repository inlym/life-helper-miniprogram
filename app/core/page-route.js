'use strict'

const makeUrl = require('./make-url')
const { DATA_TRANSFERRED_FIELDS } = require('./constants')

/**
 * 页面跳转 + 传值
 * @param {string} path 页面路径
 * @param {Object} params 参数对象
 * @param {Object} data 传值数据对象
 */
exports.goTo = function goTo(path, params, data) {
  wx.navigateTo({
    url: makeUrl(path, params),
    success(res) {
      if (typeof data === 'object') {
        res.eventChannel.emit('PageDataDuplication', data)
      }
    },
  })
}

/**
 * 在页面 `onLoad` 生命周期需要做的事
 * @this WechatMiniprogram.Page.Instance
 *
 * todo 暂时该函数未加入 `CustomPage` 中（代码未测试）
 */
exports.onLoadHandler = function onLoadHandler() {
  const eventChannel = this.getOpenerEventChannel()
  if (eventChannel.on) {
    eventChannel.on('PageDataDuplication', (data) => {
      console.log('data: ', data)
      this.setData(data)
      this.setData({ [DATA_TRANSFERRED_FIELDS]: Object.keys(data) })
    })
  }
}
