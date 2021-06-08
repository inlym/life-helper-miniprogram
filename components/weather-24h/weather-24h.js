'use strict'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleHourItemTap(event) {
      console.log(event)

      // 跳转未来 24 小时预报页
    },
  },
})
