'use strict'

/**
 * 静默检测授权状态
 * @param {string} scope 权限名称
 * @return {Promise<number>} 授权状态：0：已授权，1：未请求过授权，2：请求授权被拒绝
 *
 * `scope` 列表
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
async function getAuthStatus(scope) {
  const result = await wx.getSetting()
  if (result.authSetting[scope] === true) {
    return 0
  } else if (result.authSetting[scope] === undefined) {
    return 1
  } else if (result.authSetting[scope] === false) {
    return 2
  } else {
    throw new Error('未知错误')
  }
}

/**
 * 打开小程序设置界面，并返回某项权限的设置结果
 * @param {string} scope 权限名称
 * @return {Promise<boolean>} 是否获取权限
 */
function openSettingResult(scope) {
  return new Promise((resolve) => {
    wx.openSetting({
      success(res) {
        if (res.authSetting[scope]) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail() {
        resolve(false)
      },
    })
  })
}

/**
 * 请求授权，并返回某项权限的设置结果
 * @param {string} scope 权限名称
 * @return {Promise<boolean>} 是否获取权限
 */
function authorizeResult(scope) {
  return new Promise((resolve) => {
    wx.authorize({
      scope,

      // 点击 “允许” 按钮
      success() {
        resolve(true)
      },

      // 点击 “拒绝” 按钮。备注：被拒绝后，后面再调用 `wx.authorize` 将没有任何反应
      fail() {
        resolve(false)
      },
    })
  })
}

module.exports = {
  getAuthStatus,
  openSettingResult,
  authorizeResult,
}
