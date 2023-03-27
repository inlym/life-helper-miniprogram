import {AiChatMessage, appendMessage, createAiChat} from './../../../app/services/ai'
import {showSingleButtonModel} from '../../../app/utils/wx'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    messages: [] as AiChatMessage[],

    /** 用户输入的消息内容 */
    inputValue: '',

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
  async onLoad() {
    const {id, messages} = await createAiChat()
    this.setData({id, messages})
  },

  handleInput(e: any) {
    const prompt = e.detail.value
    this.setData({prompt})
  },

  resetInput() {
    this.setData({inputValue: ''})
  },

  /** 发送消息 */
  async send() {
    const {prompt, messages, id} = this.data

    if (!prompt) {
      showSingleButtonModel('你没有输入内容哦')
      return
    }

    // 定时器：防止出现异常，按钮一直禁用
    setTimeout(() => {
      if (this.data.buttonDisabled) {
        this.setData({buttonDisabled: false, loading: false})
      }
    }, 30000)

    messages.push({role: 'user', content: prompt, id: ''} as AiChatMessage)

    this.setData({buttonDisabled: true, loading: true, messages, prompt: ''})
    this.resetInput()
    wx.pageScrollTo({scrollTop: 99999})

    const aiChat = await appendMessage(id, prompt)

    // 这里可能报一个 504 错误，暂时还不想处理
    if (aiChat && aiChat.messages) {
      this.setData({buttonDisabled: false, messages: aiChat.messages, loading: false})
      wx.pageScrollTo({scrollTop: 99999})
    }
  },
})
