import {PageChannelEvent} from '../../../app/core/constant'
import {UserInfo} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/user/user-info/user-info.ts
Page({
  data: {
    /** 用户资料 */
    userInfo: {} as UserInfo,
  },

  behaviors: [themeBehavior],

  /** 初始化方法 */
  init() {
    // todo
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    // 第一次加载页面，数据由上个页面带过来
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)
      })
    }
  },
})
