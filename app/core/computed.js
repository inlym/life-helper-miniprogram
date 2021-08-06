'use strict'

const logger = require('./logger')

/**
 * 在小程序 `Page` 中实现 `computed` 功能
 * @this WechatMiniprogram.Page.Instance
 *
 * @method this.originalSetData 原生的 `setData`
 *
 * 主要原理：
 * 1. 接管原生 `setData`，使得每次调用完后，对 `computed` 中的字段也做一次赋值
 */
module.exports = function newSetData(data) {
  if (typeof data !== 'object') {
    throw new Error('赋值失败，要求 `data` 是一个对象')
  }

  this.originalSetData(data)

  // 进入到 `computed` 环节
  if (Object.keys(data).length === 0 || typeof this.computed !== 'object' || Object.keys(this.computed).length === 0) {
    return
  }

  const computedData = Object.keys(this.computed).reduce((obj, key) => {
    if (typeof this.computed[key] !== 'function') {
      throw new Error('在 `computed` 配置的键值要求是一个函数！')
    }

    let result = null
    try {
      result = this.computed[key].call(this, this.data)
    } catch (err) {
      logger.error(`[Computed] ${key} 在计算时出错！`)
    }

    // 新的计算值与旧的值不一样才需要重新赋值
    if (JSON.stringify(result) !== JSON.stringify(this.data[key])) {
      obj[key] = result
    }

    return obj
  }, {})

  // 无赋值内容情况
  if (Object.keys(computedData).length === 0) {
    return
  }

  this.originalSetData(computedData)
}
