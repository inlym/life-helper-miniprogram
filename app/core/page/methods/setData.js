'use strict'

const logger = require('../../logger.js')

/**
 * 重写小程序原生的 setData 方法
 * @2021-02-25
 * @this
 * @param {Object} assignment 待赋值的对象
 */
module.exports = function setData(assignment) {
  const computed = this.computed || {}

  /** 计算属性的键名列表 */
  const computedKeys = Object.keys(computed)

  /** 待赋值操作的键名列表 */
  const pendingKeys = Object.keys(assignment)

  // 对准备赋值的属性逐个判断该变量是否在计算属性中，若是则直接拒绝
  for (let i = 0; i < pendingKeys.length; i++) {
    if (computedKeys.includes(pendingKeys[i])) {
      throw new Error('计算属性 computed 中的变量不允许手动赋值！')
    }
  }

  // 使用原生 setData 赋值
  this._originalSetData(assignment)

  // 赋值日志
  if (this._debugOptions.setData) {
    logger.debug('[setData - Original] \n', assignment)
  }

  // 逐个判断计算属性中的值是否要更新（先记录，再一次性更新）
  const computedAssignment = {}
  for (let i = 0; i < computedKeys.length; i++) {
    const key = computedKeys[i]
    const oldValue = this.data[key]
    let newValue = {}
    try {
      newValue = computed[key](this.data)
    } catch (err) {
      if (this._debugOptions.setData) {
        logger.error(err)
      }
    }

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      // 前后的值不同，则需要重新赋值
      computedAssignment[key] = newValue
    }
  }

  if (Object.keys(computedAssignment).length > 0) {
    this._originalSetData(computedAssignment)
    if (this._debugOptions.setData) {
      logger.debug('[setData - Computed] \n', computedAssignment)
    }
  }
}
