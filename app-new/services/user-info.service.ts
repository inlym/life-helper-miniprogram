import { request } from '../core/request'

export interface UpdateUserInfoResponse {
  avatarUrl: string
  city: string
  country: string
  gender: number
  nickName: string
  province: string
}

/**
 * 弹窗授权获取并更新用户信息
 */
export async function updateUserInfo(): Promise<UpdateUserInfoResponse | null> {
  return new Promise((resolve) => {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '这是配置项的 `desc`',
      success(res) {
        request<UpdateUserInfoResponse>({
          method: 'PUT',
          url: '/userinfo',
          data: res.userInfo,
        }).then((response) => {
          resolve(response.data)
        })
      },
      fail() {
        // 用户点击了拒绝会进入到 `fail` 中
        wx.showModal({
          title: '提示',
          content: '你点击了拒绝，更新个人信息失败！请重新点击并选择【允许】！',
          showCancel: false,
          confirmText: '我知道了',
        })
        resolve(null)
      },
    })
  })
}
