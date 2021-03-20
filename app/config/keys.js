'use strict'

module.exports = {
  /** 发送请求时用于传递 token 值的请求头字段名 */
  HEADER_TOKEN_FIElD: 'x-lh-token',

  /** 发送请求时用于传递微信小程序 wx.login 获取的 code 值的请求头字段名 */
  HEADER_CODE_FIElD: 'x-lh-code',

  /** 发送请求时用于传递微信小程序基本信息的请求头字段名 */
  HEADER_MPINFO_FIElD: 'x-lh-miniprogram',

  /** 在小程序 storage 中用于存储 token 的字段名 */
  STORAGE_TOKEN_FIElD: '__app_token__',

  /** 在小程序 storage 中用于存储最近一次登录时间的字段名 */
  STORAGE_lAST_lOGIN_TIME: '__time_last_login__',

  /** 在小程序 storage 中用于存储小程序本次启动时间的字段名 */
  STORAGE_APP_lAUNCH_TIME: '__time_app_launch__',

  /** 在小程序 storage 中用于存储用于天气定位经纬度等数据的字段名 */
  STORAGE_WEATHER_lOCATION: '__weather_location__',
}
