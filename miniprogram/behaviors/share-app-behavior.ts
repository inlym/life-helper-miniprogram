import {StaticUrl} from '../app/core/constant'

/**
 * 分享操作混合器
 */
export const shareAppBehavior = Behavior({
  methods: {
    /** 生命周期事件 —— 用户点击转发按钮 */
    onShareAppMessage() {
      return {
        title: '这是什么神仙小程序，也太好用了吧 ~',
        path: 'pages/index/index',
        imageUrl: StaticUrl.shareAppLogo,
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
