/**
 * 信授权相关方法
 */

/** 授权状态 */
import {AuthSetting} from '../utils/wx-typings'

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
