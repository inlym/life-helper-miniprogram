'use strict'

/**
 * 配置 debug 对象，有以下属性：
 * - setData: true        每一次调用 this.setData 时都会打印
 * - request: true        每一个请求都会打印日志
 * - config: true         打印最终生效的配置（仅包含以下属性：data, computed, requested）
 */

/** 在页面的 data 中存储 debug 参数的字段名 */
const field = '__page_debug__'

/**
 * 检查是否开启某项调试参数
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 在各自方法里引用和调用，无需绑定到 page 上
 */
function check(name) {
  const debugOpt = this.data[field]

  if (debugOpt === true) {
    return true
  }

  if (typeof debugOpt === 'object' && debugOpt[name]) {
    return true
  }

  return false
}

/**
 * 在页面的 data 中存储调试参数
 * @this WechatMiniprogram.Page.Instance
 * @description
 * 执行时间应在重定义原生方法后，页面 onLoad 前（仅执行一次即可，无需绑定到页面方法）
 */
function saveDebugOptions() {
  const debugOptions = this.debug
  if (debugOptions) {
    this._originalSetData({
      [field]: debugOptions,
    })
  }
}

module.exports = {
  check,
  saveDebugOptions,
}
