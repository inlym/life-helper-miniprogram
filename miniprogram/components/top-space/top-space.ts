// components/top-space/top-space.ts

/**
 * ## 注意事项
 * 1. 使用本组件时，需要开启 **自定义导航栏** （` "navigationStyle": "custom" `）
 */
Component({
  /** 组件的属性列表 */
  properties: {
    /** 相对于胶囊按钮底部往下的偏移量，单位：px */
    offset: {
      type: Number,
      value: 0,
    },
  },

  /** 组件的初始数据 */
  data: {
    /** 顶部保留高度，为预估的胶囊按钮底部相对于屏幕顶部的高度 */
    reservedHeight: 80,
  },

  /** 组件的生命周期 */
  lifetimes: {
    attached() {
      this.resetReservedHeight()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 根据胶囊按钮重置保留高度 */
    resetReservedHeight() {
      /** 胶囊按钮下边界坐标 */
      const { bottom } = wx.getMenuButtonBoundingClientRect()
      this.setData({
        reservedHeight: bottom,
      })
    },
  },
})
