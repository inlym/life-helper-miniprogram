// pages/me/me.ts
import {PageChannelEvent} from '../../app/core/constant'
import {getIpInfo} from '../../app/services/ip'
import {IpInfo} from '../../app/services/ip.interface'
import {getUserInfo, UserInfo} from '../../app/services/userinfo'
import {shareAppBehavior} from '../../behaviors/share-app-behavior'
import {themeBehavior} from '../../behaviors/theme-behavior'

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

  behaviors: [themeBehavior, shareAppBehavior],

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
    const ipDesc = ipInfo.ip + (ipInfo.region ? ` (${ipInfo.region})` : '')
    this.setData({ipInfo, ipDesc})
  },

  /** 复制 IP 地址 */
  async copyIp() {
    const ip = this.data.ipInfo.ip
    wx.vibrateShort({type: 'medium'})
    wx.setClipboardData({data: ip})
  },

  /** 监听头像的图片加载完成 */
  onAvatarLoad() {
    this.animate(
      '.avatar',
      [
        {offset: 0, scale: [1], rotateX: 0},
        {offset: 0.5, scale: [0.9], rotateX: 180},
        {offset: 1, scale: [1], rotateX: 0},
      ],
      700,
      () => {
        this.clearAnimation('.avatar', {scale: true})
      }
    )
  },

  /** 跳转到【个人信息】页面 */
  goToUserInfoPage() {
    const {userInfo} = this.data
    wx.navigateTo({url: '/pages/user/user-info/user-info'}).then((res) => {
      res.eventChannel.emit(PageChannelEvent.DATA_TRANSFER, {userInfo})
    })
  },
})
