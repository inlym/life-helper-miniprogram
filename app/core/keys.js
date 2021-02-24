'use strict'

/**
 * 当前文件存放存入 storage 的键名映射关系
 * - 部分为完整键名，部分为键名前缀
 */

module.exports = {
  /** 最近一次更新的用户定位获取的经纬度坐标信息，非用户选点位置 */
  KEY_CURRENT_LOCATION: 'location:current',

  /** 用户选点位置信息，非定位产生 */
  KEY_CHOOSE_LOCATION: 'location:choose',

  /** 小程序启动时间 */
  KEY_APP_LAUNCH_TIME: 'time:appOnLaunch',

  /** 小程序启动或且前台时间 */
  KEY_APP_SHOW_TIME: 'time:appShow',
}
