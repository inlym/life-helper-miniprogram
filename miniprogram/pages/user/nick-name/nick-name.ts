// pages/user/nick-name/nick-name.ts

import {getUserInfo, updateNickName} from '../../../app/services/userinfo'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    /** 当前使用的昵称 */
    currentNickName: '',

    /** 输入框中输入的昵称 */
    inputNickName: '',

    // ================================ 页面状态数据 ================================

    /** 提交按钮是否禁用 */
    submitButtonDisabled: false,

    /** 提交按钮是否带 loading 图标 */
    submitButtonLoading: false,
  },

  behaviors: [themeBehavior],

  /** 页面初始化方法 */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({currentNickName: userInfo.nickName, inputNickName: userInfo.nickName})
  },

  onLoad() {
    this.init()
  },

  /** 处理键盘输入事件 */
  handleInput(e: WechatMiniprogram.CustomEvent<{value: string}>) {
    this.setData({inputNickName: e.detail.value})
  },

  /** 提交修改昵称 */
  async submit() {
    const nickName = this.data.inputNickName
    this.setData({
      submitButtonDisabled: true,
      submitButtonLoading: true,
    })

    if (nickName === this.data.currentNickName) {
      wx.navigateBack()
    } else {
      await updateNickName(nickName)

      // 设置成功之后的提示
      this.setData({
        submitButtonDisabled: false,
        submitButtonLoading: false,
      })

      wx.showToast({
        title: '设置成功',
        icon: 'success',
        mask: true,
        duration: 1500,
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },
})
