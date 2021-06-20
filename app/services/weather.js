'use strict'

const request = require('../core/request')

/**
 * 添加新的关注天气地点
 *
 * 说明：
 * 1. 需在已获取 `scope.userLocation` 授权后调用
 */
exports.addWeatherCity = async function addWeatherCity() {
  const location = await wx.chooseLocation()

  if (!location.name || !location.address) {
    // 进入到 “选择位置” 页面，不选择地点，直接点右上角的 “确定”，返回结果的 `name` 和 `address` 两个字段将为空字符串
    wx.showModal({
      title: '提示',
      content: '你没有选择地点哦！请点击地点后，再点击右上角的确定',
      showCancel: false,
      confirmText: '我知道了',
    })
  } else {
    request({
      url: '/weather/city',
      method: 'post',
      data: location,
    })
  }
}
