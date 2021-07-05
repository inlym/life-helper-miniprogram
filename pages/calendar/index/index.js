'use strict'

const { CustomPage } = getApp()

CustomPage({
  data: {
    /**
     * 任务列表
     */
    list: [],

    slideButtons: [
      {
        text: '普通',
      },
      {
        text: '普通',
      },
      {
        type: 'warn',
        text: '删除',
      },
    ],
  },

  computed: {},

  requested: {
    page: {
      url: '/calendar/tasks',
    },
  },

  onLoad() {},

  /**
   * 点击滑块
   */
  handleSlideTap(e) {
    console.log(e)
  },

  /**
   * 点击滑块右侧的按钮
   */
  handleSlideButtonTap(e) {
    console.log(e)
  },
})
