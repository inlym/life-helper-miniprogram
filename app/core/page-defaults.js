'use strict'

const getResUrl = require('./resource-path')

/** 存放页面默认配置，当页面配置同名设置项时，将覆盖本页内容 */
module.exports = {
  /** 用户点击右上角转发 */
  onShareAppMessage() {
    return {
      imageUrl: getResUrl('share-main'),
      title: '你上次问我要那个查天气的小程序，我发给你了哦',
      path: '/pages/index/index',
    }
  },

  /** 用户点击右上角菜单“分享到朋友圈”按钮 */
  onShareTimeline() {
    return {
      title: '[来自好友推荐] 好友评价：五星好评的智能生活助手',
    }
  },

  /** 用户点击右上角收藏 */
  onAddToFavorites() {
    return {
      title: '来源于 我的个人助手',
      url: getResUrl('logo'),
    }
  },
}
