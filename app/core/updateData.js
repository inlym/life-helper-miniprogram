'use strict'

const logger = require('./logger.js')

/**
 * 封装小程序的 setData 方法
 * @since 2021-02-25
 * @this
 * @param {object} assignment 需要重新赋值对象
 *
 * 功能点：
 * 1. 自动更新 computed 里面的属性
 */

function updateData(assignment) {
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

  // 完成正常的赋值操作
  this.setData(assignment)

  // 逐个判断计算属性中的值是否要更新（先记录，再一次性更新）
  const computedAssignment = {}
  for (let i = 0; i < computedKeys.length; i++) {
    const key = computedKeys[i]
    const oldValue = this.data[key]
    let newValue = {}
    try {
      newValue = computed[key](this.data)
    } catch (err) {
      logger.error(err)
    }

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      // 前后的值不同，则需要重新赋值
      computedAssignment[key] = newValue
    }
  }
  this.setData(computedAssignment)
}

module.exports = updateData
