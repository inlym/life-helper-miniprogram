'use strict'

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    /** 相对于胶囊按钮底部往下的偏移量，单位：px */
    offset: {
      type: Number,
      value: 0,
    },

    /** 不透明度，透传至 CSS 的 opacity 属性。默认为 1，即背景色为纯白色 */
    opacity: {
      type: Number,
      value: 1,
    },
  },

  data: {
    /** 顶部保留高度，为预估的胶囊按钮底部相对于屏幕顶部的高度 */
    reservedHeight: 80,
  },

  lifetimes: {
    attached() {
      /** 胶囊按钮下边界坐标 */
      const { bottom } = wx.getMenuButtonBoundingClientRect()
      this.setData({
        reservedHeight: bottom,
      })
    },
  },

  methods: {},
})
