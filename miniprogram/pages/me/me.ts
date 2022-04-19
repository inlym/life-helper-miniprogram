// pages/me/me.ts
import {getIpInfo} from '../../app/services/ip'
import {IpInfo} from '../../app/services/ip.interface'
import {getUserInfo, updateUserInfo} from '../../app/services/userinfo'
import {UserInfo} from '../../app/services/userinfo.interface'
import {mixedBehavior} from '../../behaviors/mixed-bahavior'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 用户资料 */
    userInfo: {} as UserInfo,

    /** IP 信息 */
    ipInfo: {} as IpInfo,

    /** 将 IP 信息拼接成一句话描述 */
    ipDesc: '',
  },

  behaviors: [mixedBehavior],

  /**
   * 页面初始化方法
   */
  init() {
    this.getUserInfo()
    this.getIpInfo()
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

  /** 获取用户信息 */
  async getUserInfo() {
    const userInfo = await getUserInfo()
    this.setData({userInfo})
  },

  /** 获取 IP 信息 */
  async getIpInfo() {
    const ipInfo = await getIpInfo()
    const ipDesc = `${ipInfo.ip}（${ipInfo.region}）`
    this.setData({ipInfo, ipDesc})
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

    this.setData({userInfo})
    await updateUserInfo(userInfo)
  },
})
