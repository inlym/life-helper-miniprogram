'use strict'

/**
 * 静默检测是否获取某项权限
 * @since 2021-02-25
 * @param {string} scope
 * @return {boolean} 是否已授权
 */
function check(scope) {
  return new Promise((resolve) => {
    wx.getSetting({
      success(res) {
        resolve(Boolean(res['authSetting'][scope]))
      },
    })
  })
}

/**
 * 封装获取授权方法
 * @since 2021-02-20
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 * @param {string} scope 需要获取权限的 scope
 * @return {boolean} 是否已授权
 */
function get(scope) {
  return new Promise((resolve, reject) => {
    // 获取用户权限信息
    wx.getSetting({
      success(res) {
        const status = res['authSetting'][scope]
        if (status === true) {
          // 该值为 true，表明弹出过授权且用户已同意授权
          resolve(true)
        } else if (status === false) {
          // 该值为 false，表明弹出过授权且用户已拒绝授权

          // 弹窗告知需要获取授权
          wx.showModal({
            title: '系统提示',
            content: '为保证功能正常使用，需要您开启相应权限！',
            confirmText: '去设置',
            cancelText: '我不想用',
            success(res) {
              if (res.confirm) {
                // 用户点了“确定”按钮

                // 调起设置界面
                wx.openSetting({
                  success(res) {
                    const status = res['authSetting'][scope]

                    if (status) {
                      // 用户已操作开启该项权限
                      resolve(true)
                    } else {
                      // 用户没开启，再提醒一次继续操作
                      wx.showModal({
                        title: '系统提示',
                        content: '你刚刚好像并未开启权限，需要你开启权限后功能才能正常使用哦！',
                        confirmText: '重新设置',
                        cancelText: '放弃',
                        success(res) {
                          if (res.confirm) {
                            wx.openSetting({
                              success(res) {
                                const status = res['authSetting'][scope]

                                // 不论允许还是仍为拒绝，都不再提醒了
                                resolve(status)
                              },
                            })
                          } else {
                            resolve(false)
                          }
                        },
                      })
                    }
                  },
                })
              } else {
                // 用户点了“取消”，无后续处理
                resolve(false)
              }
            },
          })
        } else if (status === undefined) {
          // 该值为 undefined，表明未弹出过授权

          // 向用户发起预授权
          wx.authorize({
            scope,
            success() {
              // 系统授权弹窗，用户点击“允许”
              resolve(true)
            },
            fail() {
              // 系统授权弹窗，用户点击“不允许”
              wx.showModal({
                title: '系统提示',
                content: '你刚刚点击了“不允许”，需要你开启权限后功能才能正常使用哦！',
                confirmText: '重新开启',
                cancelText: '不需要',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        const status = res['authSetting'][scope]

                        // 不论允许还是仍为拒绝，都不再提醒了
                        resolve(status)
                      },
                    })
                  } else {
                    resolve(false)
                  }
                },
              })
            },
          })
        } else {
          reject(new Error('未知错误'))
        }
      },
    })
  })
}

module.exports = {
  get,
  check,
}
