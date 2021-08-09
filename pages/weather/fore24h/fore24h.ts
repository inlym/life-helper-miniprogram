// {{page}}.ts
Page({
  /** 页面的初始数据 */
  data: {
    fore24h: {
      list: [],
    },

    /** 当前展示列表的索引 */
    currentIndex: 0,

    /** scroll-view 的当前居首项 ID */
    scrollIndex: 's-0',
  },

  computed: {},

  requested: {},

  /** 生命周期函数--监听页面加载 */
  onLoad() {},

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {
    const { index } = this.getQuery()
    this.show(parseFloat(index, 10))
  },

  /** 生命周期函数--监听页面显示 */
  onShow() {},

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {},

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** 展示指定索引的项目 */
  show(index) {
    if (index === 0 || index === 1) {
      this.setData({
        scrollIndex: 's-0',
        currentIndex: index,
      })
    } else {
      this.setData({
        scrollIndex: `s-${index - 2}`,
        currentIndex: index,
      })
    }
  },

  /** swiper 滑块滑动事件处理 */
  handleSwiperChange(event) {
    const { current: index, source } = event.detail
    if (source === 'touch') {
      this.show(index)
    }
  },

  /** 处理 scroll-view 中元素点击 */
  handleScorllItemTap(event) {
    const { index } = event.currentTarget.dataset
    this.show(index)
  },
})
