import {logger} from '../app/core/logger'
import {ParamsUtils} from '../app/utils/params-utils'

export const pageLifetimesBehavior = Behavior({
  data: {
    /** 页面入参 */
    __page_query__: {},

    /** 页面完整路径 */
    __page_url__: '',

    /** 是否正在展示 loading 提示框 */
    __page_on_show_loading__: false,

    /** 是否正在发送请求 */
    __page_on_requesting__: false,

    /** 是否正在进行下拉刷新 */
    __page_on_pull_down_refresh__: false,

    /** 上一次进行数据刷新的时间戳 */
    __page_last_refresh_time__: 0,
  },

  methods: {
    /** 生命周期事件 —— 页面加载 */
    onLoad(query: Record<string, string>) {
      this.pageInit(query)
      this.init()
    },

    /** 生命周期事件 —— 用户进行下拉刷新 */
    onPullDownRefresh() {
      // 如果发起请求时，间隔小于该时间，则直接使用旧数据
      const freeDuration = 10 * 1000

      if (Date.now() - this.data.__page_last_refresh_time__ < freeDuration) {
        setTimeout(() => {
          wx.stopPullDownRefresh()
          this._showSuccessToast()
        }, 1000)
      } else {
        this.setData({__page_on_pull_down_refresh__: true})
        this.init().then(() => {
          this._showSuccessToast()
        })
      }
    },

    /** 生命周期事件 —— 用户点击转发按钮 */
    onShareAppMessage() {
      return {
        title: '我最近一直在用这个小程序查天气，你也来试试吧！',
        path: 'pages/index/index',
        imageUrl: 'https://static.lifehelper.com.cn/static/project/share.jpeg',
      }
    },

    /** 页面初始化，页面生命周期内执行一次就行了 */
    pageInit(query: Record<string, string>) {
      // 本地存储查询参数
      this.setData({__page_query__: query})

      // 计算并存储页面完整 URL
      const url = this.getPageUrl()
      this.setData({__page_url__: url})
      logger.debug('进入页面, url=' + url)
    },

    /** 页面数据初始化，在页面生命周期内可能多次调用 */
    async init() {
      this.setData({__page_on_requesting__: true})
      setTimeout(() => {
        if (this.data.__page_on_requesting__) {
          this._showLoading()
        }
      }, 2000)

      await this.start()
      this.setData({__page_on_requesting__: false})
      this._hideLoading()
      this._stopPullDownRefresh()
      this._saveRefreshTime()
    },

    /**
     * 获取某个查询参数的值
     */
    getQuery(key: string): string {
      return this.data.__page_query__[key]
    },

    /**
     * 获取页面路径（不带查询字符串）
     */
    getPagePath(): string {
      const pages = getCurrentPages()
      return pages[pages.length - 1].route
    },

    /**
     * 获取页面完成路径（带查询字符串）
     */
    getPageUrl(): string {
      const path = this.getPagePath()
      const qs = ParamsUtils.encode(this.data.__page_query__)

      return qs ? path + '?' + qs : path
    },

    /**
     * 显示 loading 提示框
     */
    _showLoading() {
      wx.showLoading({title: '数据加载中'}).then(() => {
        this.setData({__page_on_show_loading__: true})
        setTimeout(() => {
          if (this.data.__page_on_show_loading__) {
            this._hideLoading()
          }
        }, 5000)
      })
    },

    /**
     * 隐藏 loading 提示框
     */
    _hideLoading() {
      if (this.data.__page_on_show_loading__) {
        this.setData({__page_on_show_loading__: false})
        wx.hideLoading()
      }
    },

    /** 记录数据刷新时间 */
    _saveRefreshTime() {
      this.setData({__page_last_refresh_time__: Date.now()})
    },

    /** 停止下拉刷新 */
    _stopPullDownRefresh() {
      if (this.data.__page_on_pull_down_refresh__) {
        wx.stopPullDownRefresh()
      }
    },

    /** 弹出数据更新成功的提示 */
    _showSuccessToast() {
      wx.showToast({
        icon: 'success',
        title: '数据已更新',
      })
    },
  },
})
