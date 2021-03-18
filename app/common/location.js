'use strict'

const authorize = require('./authorize.js')

/**
 * 获取当前定位数据
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

function chooseLocation(options) {
  const scope = 'scope.userLocation'
  options = options || {}
  const { longitude, latitude } = options

  return new Promise((resolve) => {
    authorize.get(scope).then((res) => {
      if (!res) {
        resolve(false)
      }
      wx.chooseLocation({
        longitude,
        latitude,
        success(res2) {
          if (!res2.name) {
            wx.showModal({
              content: '你没有选中地点，请先点击选择地点后，再点击确定！',
              confirmText: '重新操作',
              cancelText: '放弃',
              cancelColor: '#fa5151',
              success(res3) {
                if (res3.confirm) {
                  wx.chooseLocation({
                    longitude: res2.longitude,
                    latitude: res2.latitude,
                    success(res4) {
                      if (!res4.name) {
                        wx.showToast({ title: '你仍然没有选中任何地点！', icon: 'none' })
                        resolve(false)
                      } else {
                        resolve(res4)
                      }
                    },
                  })
                } else {
                  resolve(false)
                }
              },
            })
          } else {
            resolve(res2)
          }
        },
      })
    })
  })
}

module.exports = {
  getLocation,
  chooseLocation,
}
