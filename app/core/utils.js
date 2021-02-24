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

module.exports = {
  matchStr,
  zerofill,
  formatMs,
  now,
  nowMs,
}
