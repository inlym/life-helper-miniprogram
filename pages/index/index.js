//index.js
//获取应用实例
const app = getApp()

Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    app.post({
      headers: {
        'X-Token': 'laiyiming',
      },
      params: {
        age: 19,
        idGood: true
      },
      url: '/debug',
      data: {
        name: 'tttoaaa'
      }
    }).then(res => {
      console.log(res)
    })
  },
})
