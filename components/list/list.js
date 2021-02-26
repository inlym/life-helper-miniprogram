// components/list/list.js
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    title: {
      type: String,
      value: '',
    },

    /**
     * 数组项目为对象，包含以下属性：
     * 1. icon - 图标，支持本地和网络图
     * 2. name - 左边标题文字
     * 3. desc - 右边说明文字
     * 4. url  - 点击跳转链接
     */
    list: {
      type: Array,
      value: [],
    },
  },

  data: {},

  methods: {},
})
