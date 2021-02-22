'use strict'

const storage = require('../core/storage.js')

/**
 * 静默更新当前定位数据
 * - 用于实时性要求比较低的场景，在已获取定位授权情况下，每次打开页面更新一次定位（静默更新，若无授权则不进行任何操作）
 *
 * @since 2021-02-22
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
 * @returns {Promise<{longitude:number;latitude:number;}> | Promise<boolean>} 正常情况返回经纬度坐标对象，异常直接返回 false
 */
function updateCurrentLocationSilently() {
  return new Promise((resolve, reject) => {
    // 检查是否获取定位权限
    wx.getSetting({
      success(res) {
        const scope = 'scope.userLocation'
        const status = res['authSetting'][scope]
        if (!status) {
          // 当前未获取定位权限，不再继续
          resolve(false)
        } else {
          // 当前已获取定位权限
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              const location = {
                latitude: res.latitude,
                longitude: res.longitude,
              }
              storage.set(storage.keys.KEY_CURRENT_LOCATION, location)
              resolve(location)
            },
          })
        }
      },
    })
  })
}

module.exports = {
  updateCurrentLocationSilently,
}
