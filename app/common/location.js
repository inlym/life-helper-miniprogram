'use strict'

/**
 * 获取当前定位数据
 *
 * @since 2021-02-22
 * @update 2021-02-28
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
 * @returns {Promise<{longitude:number;latitude:number;}> | Promise<boolean>} 正常情况返回经纬度坐标对象，异常直接返回 false
 */
function getLocation() {
  return new Promise((resolve) => {
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
            success(locationResult) {
              const location = {
                longitude: locationResult.longitude,
                latitude: locationResult.latitude,
              }
              resolve(location)
            },
          })
        }
      },
    })
  })
}

module.exports = {
  getLocation,
}
