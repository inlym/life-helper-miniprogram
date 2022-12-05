import {getUserInfo, updateGenderType, updateRegion, UserInfo} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

// pages/user/user-info/user-info.ts
Page({
  data: {
    /** 用户资料 */
    userInfo: {} as UserInfo,

    // ================================ 页面状态数据 ================================
    genders: ['男', '女'],
  },

  behaviors: [themeBehavior],

  /** 初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({userInfo})
  },

  // 由于这几个页面经常往返跳转，因此简化处理，每次展示页面都直接刷新数据（从缓存中读取）
  onShow() {
    this.init()
  },

  /** 处理性别选择器改变事件 */
  handleGenderChange(e: WechatMiniprogram.CustomEvent<{value: string}>) {
    const index = parseInt(e.detail.value)

    // 性别直接在当前页面修改显示了，不等响应返回再改
    const gender = this.data.genders[index]
    const userInfo = this.data.userInfo
    userInfo.gender = gender
    this.setData({userInfo})

    // 性别类型：1-男，2-女
    const genderType = index + 1
    updateGenderType(genderType)
  },

  /** 处理地区选择器改变事件 */
  async handleRegionChange(e: WechatMiniprogram.CustomEvent<{code: string[]; value: string[]}>) {
    let cityId

    if (e.detail.value[0].indexOf('市') != -1) {
      cityId = parseInt(e.detail.code[0])
    } else {
      cityId = parseInt(e.detail.code[1])
    }

    if (cityId > 0) {
      await updateRegion(cityId)
      this.init()
    }
  },

  /** 跳转到【头像预览】页 */
  goToAvatarPage() {
    wx.navigateTo({url: '/pages/user/avatar/avatar'})
  },

  /** 跳转到【设置昵称】页 */
  goToNickNamePage() {
    wx.navigateTo({url: '/pages/user/nick-name/nick-name'})
  },

  /** 跳转到【账户 ID】页 */
  goToAccountIdPage() {
    wx.navigateTo({url: '/pages/user/account-id/account-id'})
  },

  /** 跳转到【账户 ID】页 */
  goToRegisterTime() {
    wx.navigateTo({url: '/pages/user/register-time/register-time'})
  },
})
