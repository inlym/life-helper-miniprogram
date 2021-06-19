'use strict'

/**
 * 比较是否匹配，一般用于配置项比较
 * @param {string} source 待比较的字符串
 * @param {string} target 被比较的字符串或数组
 */
function matchStr(source, target) {
  if (source === undefined || target === undefined) {
    return false
  }

  if (typeof target === 'string') {
    return source === target
  } else {
    return target.includes(source)
  }
}

/**
 * 对数字补零到指定位数
 * @param {number} number 被格式化的数字
 * @param {number} digit 格式化的位数
 * @returns {string}
 */
function zerofill(number, digit = 2) {
  const zero = '0'
  for (let i = 0; i < digit; i++) {
    if (number < Math.pow(10, i + 1)) {
      const str = zero.repeat(digit - i - 1) + number.toString()
      return str
    }
  }
  return number
}

/**
 * 将毫秒数格式化成文本，例如：'3h 5m 11s 111ms'
 * @param {number} ms 待格式化的毫秒数
 */
function formatMs(ms) {
  const s = 1000
  const m = s * 60
  const h = m * 60
  const d = h * 24

  /** 分隔符 */
  const sep = ' '

  /** 最终拼接的字符串 */
  let str = ''

  /** 待操作的剩余值 */
  let rest = ms

  if (rest === 0) {
    return '0ms'
  }
  if (rest >= d) {
    const day = Math.floor(rest / d)
    rest -= day * d
    str += `${day}d`
  }
  if (rest >= h) {
    const hour = Math.floor(rest / h)
    rest -= hour * h
    str += str ? `${sep}${hour}h` : `${hour}h`
  }
  if (rest >= m) {
    const minute = Math.floor(rest / m)
    rest -= minute * m
    str += str ? `${sep}${minute}m` : `${minute}m`
  }
  if (rest >= s) {
    const second = Math.floor(rest / s)
    rest -= second * s
    str += str ? `${sep}${second}s` : `${second}s`
  }
  if (rest > 0) {
    const millisecond = Math.floor(rest)
    str += str ? `${sep}${millisecond}ms` : `${millisecond}ms`
  }
  return str
}

/** 返回当前时间的标准格式 */
function now() {
  const time = new Date()
  const year = time.getFullYear()
  const month = zerofill(time.getMonth())
  const day = zerofill(time.getDate())
  const hour = zerofill(time.getHours())
  const minute = zerofill(time.getMinutes())
  const second = zerofill(time.getSeconds())
  const millisecond = zerofill(time.getMilliseconds(), 3)

  const str = `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
  return str
}

/** 返回当前时间的毫秒数 */
function nowMs() {
  return new Date().getTime()
}

/**
 * 检查 2 个数组是否包含相同的元素
 * @param {array} arr1 数组1
 * @param {array} arr2 数组2
 */
function hasSameArrayElement(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        return true
      }
    }
  }
  return false
}

/**
 * 将源数组的元素添加到目标数组上
 * @param {Array} target 目标数组
 * @param {Array} source 源数组
 */
function assignArray(target, source) {
  for (let i = 0; i < source.length; i++) {
    target.push(source[i])
  }
}

/**
 * 给配置项添加项目
 * @param {string | Array} target 配置项
 * @param {string} item 待添加的项目
 * @example
 * - 配置项可能的格式：                 undefined, 'aaa', 'bbb', ['aaa'], ['aaa', 'bbb']
 * - 给以上配置项添加 'bbb' 后需要的格式：['bbb'], ['aaa', 'bbb'], 'bbb', ['aaa', 'bbb'], ['aaa', 'bbb']
 */
function appendItem(target, item) {
  if (target === undefined) {
    return [item]
  }

  if (typeof target === 'string') {
    if (target === item) {
      return target
    } else {
      return [target, item]
    }
  }

  if (typeof target === 'object' && target.length > 0) {
    if (!target.includes(item)) {
      target.push(item)
    }
    return target
  }

  return [item]
}

/**
 * 获取指定时间的“年月日”部分
 * @since 2021-03-17
 * @description
 * 输出格式为 '2021-03-17'
 */
function getDate(time) {
  let t = null
  if (!time) {
    t = new Date()
  } else {
    t = new Date(time)
  }
  return `${t.getFullYear()}-${zerofill(t.getMonth() + 1)}-${zerofill(t.getDate())}`
}

/**
 * 将一个对象数组转变为对象
 * @param {Array<object>} arr 对象列表，格式为：[{},{},...]
 * @param {string} key 列表项目中
 * @description
 * 将 [{id:'one', ...}, {id:'two', ...}] 转变为 {'one':{...}, 'two':{...}}
 */
function convertArray2Object(arr, key) {
  if (typeof arr !== 'object' || typeof key !== 'string') {
    throw new Error('参数错误')
  }

  const result = {}

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (typeof item !== 'object') {
      throw new Error('数组项目必须是一个对象')
    }

    if (!item[key]) {
      throw new Error(`子项目对应的 ${key} 属性不存在`)
    }

    if (result[item[key]]) {
      throw new Error('列表中的对象存在重复的 key 值')
    }

    const prop = item[key]

    delete item[key]
    result[prop] = item
  }

  return result
}

module.exports = {
  matchStr,
  zerofill,
  formatMs,
  now,
  nowMs,
  hasSameArrayElement,
  assignArray,
  appendItem,
  getDate,
  convertArray2Object,
}
