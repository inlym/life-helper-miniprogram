import {StaticUrl} from '../app/core/constant'

/**
 * 分享操作混合器
 */
export const shareAppBehavior = Behavior({
  methods: {
    /** 生命周期事件 —— 用户点击转发按钮 */
    onShareAppMessage() {
      return {
        title: '好友推荐：这个小程序真的好用哭了 ~',
        path: 'pages/index/index',
        imageUrl: StaticUrl.SHARE_APP_LOGO,
      }
    },

    /** 分享到朋友圈 */
    onShareTimeline() {
      return {
        title: '这是什么神仙小程序，也太好用了吧 ~',
      }
    },
  },
})
