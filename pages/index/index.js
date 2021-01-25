//index.js
//获取应用实例
const app = getApp()

Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    app.get('/ping/redis')
    app.get('/ping/mysql')
    app.get('/ping/ots')

    app.logger.warn('sadfasd')
  },
})
