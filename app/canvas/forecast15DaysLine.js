'use strict'

/**
 * 渲染未来 15 天温度（最高温、最低温）折线图
 * @since 2021-02-19
 * @param {*} ctx 画笔
 * @param {number[]} maxList 最高温度值列表
 * @param {number[]} minList 最低温度值列表
 */
function drawForecast15DaysLine(ctx, maxList, minList) {
  /** 画布宽度 */
  const width = 1920

  /** 画布高度 */
  const height = 300

  /** 包含昨天，实际上显示 16 天的天气情况 */
  const days = 16

  /** 画布的背景色 */
  const backgroundColor = '#fff'

  /** 第 2 个格子（今天）的背景色 */
  const backgroundColorToday = '#eaeaea'

  /** 最高温度折线图线条颜色 */
  const lineColorMaxTemp = '#D54476'

  /** 最低温度折线图线条颜色 */
  const lineColorMinTemp = '#5253D7'

  /** 折线图上坐标点的圆圈半径 */
  const circleRadius = 4

  // 初始化画布
  ctx.clearRect(0, 0, width, height)

  // 获取最大温度数值 max
  let max = -999
  for (let i = 0; i < maxList.length; i++) {
    max = maxList[i] > max ? maxList[i] : max
  }

  // 获取最小温度数值 min
  let min = 999
  for (let i = 0; i < minList.length; i++) {
    min = minList[i] < min ? minList[i] : min
  }

  /** 画布高度上下留白占比：上方留白 10%，下方留白 10%，内容区为 80% */
  const space = 0.1

  /** 每摄氏度温度值所占的高度 */
  const hUnit = Math.floor((height * (1 - space * 2)) / (max - min))

  /** 一天为一个格子，计算每个格子的宽度 */
  const wUnit = width / days

  /** 计算最高温度值折线的坐标 */
  const maxCoordinate = []
  for (let i = 0; i < maxList.length; i++) {
    const x = wUnit * (0.5 + i)
    const y = height * space + (max - maxList[i]) * hUnit
    maxCoordinate.push({
      x,
      y,
    })
  }

  /** 计算最低温度值折线的坐标 */
  const minCoordinate = []
  for (let i = 0; i < minList.length; i++) {
    const x = wUnit * (0.5 + i)
    const y = height * space + (max - minList[i]) * hUnit
    minCoordinate.push({
      x,
      y,
    })
  }

  // 先画一个白色背景
  ctx.beginPath()
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  /** 给第2个格子（今天）画个背景色 */
  ctx.beginPath()
  ctx.fillStyle = backgroundColorToday
  ctx.fillRect(wUnit, -100, wUnit, height * 3)

  /** 画最高温度折线 */
  ctx.beginPath()
  for (let i = 0; i < maxCoordinate.length; i++) {
    const { x, y } = maxCoordinate[i]
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = lineColorMaxTemp
  ctx.lineWidth = 5
  ctx.stroke()

  /** 画最低温度折线 */
  ctx.beginPath()
  for (let i = 0; i < minCoordinate.length; i++) {
    const { x, y } = minCoordinate[i]
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = lineColorMinTemp
  ctx.lineWidth = 5
  ctx.stroke()

  // 画最高温度折线上的圆圈
  for (let i = 0; i < maxCoordinate.length; i++) {
    ctx.beginPath()
    const { x, y } = maxCoordinate[i]
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
    ctx.strokeStyle = lineColorMaxTemp
    ctx.lineWidth = 10
    ctx.stroke()
    ctx.arc(x, y, 1, 0, Math.PI * 2)
    ctx.fillStyle = backgroundColor
    ctx.fill()
  }

  // 画最低温度折线上的圆圈
  for (let i = 0; i < minCoordinate.length; i++) {
    ctx.beginPath()
    const { x, y } = minCoordinate[i]
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
    ctx.strokeStyle = lineColorMinTemp
    ctx.lineWidth = 10
    ctx.stroke()
    ctx.arc(x, y, 1, 0, Math.PI * 2)
    ctx.fillStyle = backgroundColor
    ctx.fill()
  }
}

module.exports = drawForecast15DaysLine
