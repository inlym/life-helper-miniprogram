// 微信授权相关方法

import AuthSetting = WechatMiniprogram.AuthSetting

/** 授权状态 */
export enum AuthorizeStatus {
  /** 已授权 */
  Authorized = 0,

  /** 未发起过授权请求 */
  NotApplied = 1,

  /** 发起过授权请求被拒绝 */
  Denied = 2,
}

/**
 * 根据授权结果检查授权状态
 * @param scope 授权项目
 * @param authSetting 用户授权结果
 */
export function checkAuthSetting(scope: keyof AuthSetting, authSetting: AuthSetting): AuthorizeStatus {
  if (authSetting[scope] === true) {
    return AuthorizeStatus.Authorized
  } else if (authSetting[scope] === false) {
    return AuthorizeStatus.Denied
  } else {
    return AuthorizeStatus.NotApplied
  }
}

/**
 * 静默检测授权状态
 *
 * @param scope 权限名称
 *
 * `scope` 列表
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
export async function getAuthorizeStatus(scope: keyof AuthSetting): Promise<AuthorizeStatus> {
  const res = await wx.getSetting()
  return checkAuthSetting(scope, res.authSetting)
}

/**
 * 打开设置页然后返回再检查是否获取授权
 *
 * @param scope 权限名称
 */
export async function openSettingAndCheck(scope: keyof AuthSetting): Promise<AuthorizeStatus> {
  const res = await wx.openSetting()
  return checkAuthSetting(scope, res.authSetting)
}

/**
 * 确保获取某项授权，授权成功则返回 true，否则返回 false
 *
 * @param scope 权限名称
 */
export async function ensureAuthorized(scope: keyof AuthSetting): Promise<boolean> {
  const res1 = await getAuthorizeStatus(scope)
  if (res1 === AuthorizeStatus.Authorized) {
    return true
  } else if (res1 === AuthorizeStatus.Denied) {
    const res2 = await wx.showModal({
      title: '系统提示',
      content: '为保证功能正常使用，需要您开启响应权限！',
      showCancel: true,
      cancelText: '取消',
      confirmText: '去设置',
    })

    // 点了「确定」按钮
    if (res2.confirm) {
      const res3 = await openSettingAndCheck(scope)
      return res3 === AuthorizeStatus.Authorized
    }
  } else {
    // 未发起过请求授权情况
    const res4 = await wx.showModal({
      title: '系统提示',
      content: '为保证功能正常使用，需要您开启响应权限！',
      showCancel: true,
      cancelText: '取消',
      confirmText: '去设置',
    })

    // 点了「确定」按钮
    if (res4.confirm) {
      await wx.authorize({ scope })
      const res5 = await getAuthorizeStatus(scope)
      return res5 === AuthorizeStatus.Authorized
    }
  }

  return false
}
