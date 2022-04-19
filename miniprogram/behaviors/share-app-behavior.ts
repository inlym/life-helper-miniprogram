export const shareAppBehavior = Behavior({
  methods: {
    onShareAppMessage() {
      return {
        title: '我最近一直在用这个小程序查天气，你也来试试吧！',
        path: 'pages/index/index',
        imageUrl: 'https://static.lifehelper.com.cn/static/project/share.jpeg',
      }
    },
  },
})
