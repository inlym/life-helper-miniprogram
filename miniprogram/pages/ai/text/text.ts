// pages/ai/text/text.ts

import {createCompletion} from '../../../app/services/ai'
import {showSingleButtonModel} from '../../../app/utils/wx'
import {themeBehavior} from '../../../behaviors/theme-behavior'

export interface Message {
  role: 'system' | 'user'
  text: string
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [] as Message[],

    /** 用户输入的消息内容 */
    prompt: '',

    /** 发送按钮禁用状态 */
    buttonDisabled: false,

    /** 是否等待中 */
    loading: false,

    logoUrl: 'https://static.lifehelper.com.cn/static/project/logo.png',
  },

  behaviors: [themeBehavior],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // createCompletion('你好啊').then(console.log)
    const list: Message[] = [{role: 'system', text: '你好，你可以问我任何问题！'}]
    this.setData({list})
  },

  inputBlur(e: any) {
    const value = e.detail.value
    this.setData({prompt: value})
  },

  /** 发送消息 */
  async send() {
    const promot = this.data.prompt
    const list = this.data.list

    if (!promot) {
      showSingleButtonModel('你没有输入内容哦')
      return
    }

    // 定时器：防止出现异常，按钮一直禁用
    setTimeout(() => {
      if (this.data.buttonDisabled) {
        this.setData({buttonDisabled: false})
      }
    }, 30000)

    list.push({role: 'user', text: promot})
    this.setData({buttonDisabled: true, loading: true, list, prompt: ''})
    wx.pageScrollTo({scrollTop: 99999})
    const result = await createCompletion(promot)
    if (result.errorCode) {
      showSingleButtonModel('当前使用用户较多，消息接收失败，请稍后再试！')
      return
    }

    const text = result.text || '我不知道你在说什么'
    list.push({role: 'system', text})
    this.setData({buttonDisabled: false, list, loading: false})
    wx.pageScrollTo({scrollTop: 99999})
  },
})
