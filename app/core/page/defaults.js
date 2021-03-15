'use strict'

/** 存放页面默认配置，当页面配置同名设置项时，将覆盖本页内容 */
module.exports = {
  data: {},

  /** 生命周期函数 */
  lifetimes: {
    /** 用户点击右上角转发 */
    onShareAppMessage(res) {
      return {
        imageUrl: 'https://img.lh.inlym.com/share/index_share.jpeg',
        title: '你上次问我要那个查天气的小程序，是不是这个？',
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
        url: 'https://img.lh.inlym.com/common/logo.png',
      }
    },
  },

  /** 内部运行相关的配置项 */
  config: {},
}
