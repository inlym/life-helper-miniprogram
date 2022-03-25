// pages/me/me.ts
import { getUserInfo, updateUserInfo, UserInfo } from '../../app/services/userinfo'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 用户资料 */
    userInfo: { nickName: '', avatarUrl: '' } as UserInfo,

    /** LOGO 图片的本地路径（当头像为空时，使用 LOGO 替代） */
    logoUrl: '/assets/images/common/logo.jpg',
  },

  /**
   * 页面初始化方法
   */
  async init() {
    const userInfo = await getUserInfo()
    this.setData({ userInfo })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.init()
  },

  /**
   * 点击「更新」按钮
   */
  async onUpdateButtonTap() {
    const result = await wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取您的头像和昵称',
    })

    const userInfo: UserInfo = {
      nickName: result.userInfo.nickName,
      avatarUrl: result.userInfo.avatarUrl,
    }

    this.setData({ userInfo })
    await updateUserInfo(userInfo)
  },
})
