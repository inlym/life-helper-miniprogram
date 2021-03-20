'use strict'

const { request } = require('../apps.js')

/**
 * 更新用户个人信息
 * @since 2021-02-24
 */
function updateUserInfo() {
  return new Promise((resolve) => {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于更新你的头像和昵称',
      success(res) {
        const { userInfo } = res
        request({
          method: 'POST',
          url: '/user/info',
          data: userInfo,
        })
        resolve(userInfo)
      },
      fail() {
        resolve(false)
      },
    })
  })
}

module.exports = {
  updateUserInfo,
}
