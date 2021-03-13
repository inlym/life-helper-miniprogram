'use strict'

/**
 * 用于向下个页面传值
 * @since 2021-03-12
 * @this
 * @param {string} field 在当前页面 data 中的属性名
 * @param {string} [newField] 下个页面用于获取的字段名
 */
function transferData(field, newField) {
  if (!field) {
    throw new Error('field 为空')
  }

  newField = newField || field

  const key = `__transfer_${newField}__`
  wx.setStorageSync(key, this.data[field])
}

/**
 * 在新页面处理从上个页面的传值
 * - 函数执行时间应该在 onLoad 中：获取 query 参数后，发起 request 请求前
 * @since 2021-03-12
 * @this
 */
function handleTransferredData() {
  const { transfer } = this.getQuery()
  if (!transfer) {
    return
  }

  // 根据逗号将字符串拆分数组
  const transferredFields = transfer.split(',')

  const tfKey = '__page_transferred_fields__'

  // 存储传值的字段
  this.setData({
    [tfKey]: transferredFields,
  })

  /** 赋值对象 */
  const assignment = {}

  // 逐个传值处理
  for (let i = 0; i < transferredFields.length; i++) {
    const field = transferredFields[i]
    const key = `__transfer_${field}__`
    const value = wx.getStorageSync(key)
    Object.assign(assignment, { [field]: value })
    wx.removeStorageSync(key)
  }
  this.setData(assignment)
}

/**
 * 获取传值字段名列表
 * @since 2021-03-12
 * @this
 */
function getTransferredFields() {
  const tfKey = '__page_transferred_fields__'
  return this.data[tfKey]
}

/**
 * 传值字段在页面 onLoad 时使用传值而不需要再次请求
 * - 处理策略：给对应的在 requested 中注册的字段加上 ignore: 'onLoad'
 * @since 2021-03-12
 * @this
 */
function handleRequestedFields() {
  if (typeof this.requested !== 'object') {
    return
  }

  const requestedKeys = Object.keys(this.requested)
  const transferredFields = this.getTransferredFields()

  if (!transferredFields) {
    return
  }

  for (let i = 0; i < requestedKeys.length; i++) {
    const key = requestedKeys[i]
    const item = this.requested[key]

    if (transferredFields.includes(key)) {
      if (item.ignore === undefined) {
        item.ignore = ['onLoad']
      } else if (item.ignore === 'onLoad') {
        // 不处理
      } else if (typeof item.ignore === 'string') {
        item.ignore = [item.ignore, 'onLoad']
      } else if (typeof item.ignore === 'object') {
        if (!item.ignore.includes('onLoad')) {
          item.ignore.push('onLoad')
        }
      }
    }
  }
}

module.exports = {
  transferData,
  handleTransferredData,
  getTransferredFields,
  handleRequestedFields,
}
