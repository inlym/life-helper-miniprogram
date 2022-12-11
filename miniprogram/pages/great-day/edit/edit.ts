// pages/great-day/edit/edit.ts

import {PageChannelEvent} from '../../../app/core/constant'
import {createGreatDay, getDateText, getEmojiList, GreatDay, updateGreatDay} from '../../../app/services/great-day'
import {Id} from '../../../app/utils/types'
import {themeBehavior} from '../../../behaviors/theme-behavior'

Page({
  data: {
    // ============================= 从HTTP请求获取的数据 =============================

    /** 可选择的 emoji 列表 */
    emojis: [] as string[],

    // ================================ 页面状态数据 ================================

    /** 操作类型：新增、编辑 */
    type: 'create' as 'create' | 'update',

    /** 提交按钮文案 */
    submitButtonText: '创建',

    /** 提交按钮是否带 loading 图标 */
    submitButtonLoading: false,

    /** 提交按钮是否禁用 */
    submitButtonDisabled: false,

    // ================================ 页面传值数据 ================================

    /**
     * 纪念日 ID
     *
     * ### 说明
     * 该值从路径参数获取，有该值说明是“编辑”操作，否则新增。
     */
    id: '',

    /**
     * 详情数据（“编辑”情况用到）
     */
    day: {} as GreatDay,

    // ================================= 表单数据 =================================

    /** 纪念日名称 */
    name: '',

    /** 日期 */
    date: '',

    /** emoji 表情 */
    icon: '',

    // ================================ 展示专用数据 ================================

    /** 格式化显示的日期 */
    formattedDate: '',
  },

  behaviors: [themeBehavior],

  onLoad(query: Record<string, string | undefined>) {
    const id = (query as unknown as Id).id
    if (id) {
      // 带了 id 说明是“编辑”情况，目前唯一入口是“详情页”跳转过来
      this.setData({id, type: 'update', submitButtonText: '保存'})

      this.getOpenerEventChannel().on(PageChannelEvent.DATA_TRANSFER, (data) => {
        this.setData(data)

        const {name, date, icon, formattedDate} = this.data.day
        this.setData({name, date, icon, formattedDate})
      })
    }

    this.init()
  },

  /** 页面初始化方法 */
  async init() {
    wx.showNavigationBarLoading()
    await this.getEmojis()
    wx.hideNavigationBarLoading()

    if (this.data.type === 'create') {
      this.changeEmoji()
    }

    if (this.data.type === 'update') {
      //
    }
  },

  /** 获取 emoji 列表 */
  async getEmojis(): Promise<void> {
    const list = await getEmojiList()
    this.setData({emojis: list})
  },

  /** 换一个 emoji */
  changeEmoji(): void {
    const list = this.data.emojis
    const icon = list[Math.floor(Math.random() * list.length)]
    this.setData({icon})
    wx.setNavigationBarTitle({title: icon})
  },

  /** 处理名称输入框失去焦点事件 */
  handleNameInputBlur(e: WechatMiniprogram.CustomEvent<{value: string}>) {
    const name = e.detail.value
    this.setData({name})
  },

  /** 处理日期选择器修改事件 */
  handleDatePickerChange(e: WechatMiniprogram.CustomEvent<{value: string}>) {
    const date = e.detail.value
    const formattedDate = getDateText(date)
    this.setData({date, formattedDate})
  },

  /** 点击“提交”按钮 */
  async submit() {
    const {id, name, date, icon} = this.data

    if (this.data.type === 'create') {
      // 提交按钮状态变更
      this.setData({
        submitButtonText: '正在创建 ...',
        submitButtonLoading: true,
        submitButtonDisabled: true,
      })

      await createGreatDay({name, date, icon})
    }

    if (this.data.type === 'update') {
      // 提交按钮状态变更
      this.setData({
        submitButtonText: '正在保存 ...',
        submitButtonLoading: true,
        submitButtonDisabled: true,
      })

      await updateGreatDay(id, {name, date, icon})
    }

    // 通过上个页面刷新数据
    this.getOpenerEventChannel().emit(PageChannelEvent.REFRESH_DATA)

    // 成功提示然后跳转返回
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })

    // 1秒后再返回，否则显得太快
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  },
})
