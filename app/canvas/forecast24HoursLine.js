'use strict'

/**
 * 渲染未来 24 小时天气预报折线图
 * @since 2021-02-19
 * @param {*} ctx
 * @param {object[]} list 数据列表
 */
function drawForecast24HoursLine(ctx, list) {
  /** 画布宽度 */
  const width = 2600

  /** 画布高度 */
  const height = 300

  /** 横向切割数 */
  const cells = 24

  /** 画布的背景色 */
  const backgroundColor = '#fff'

  /** 折线颜色 */
  const lineColor = '#5253D7'

  /** 折线底下区域颜色 */
  const underLineColor = '#AED8EE'

  /** 最高温度值在画布中的高度占比 */
  const maxRatio = 0.88

  /** 最低温度值在画布中的高度占比 */
  const minRatio = 0.3

  /** 折线底下区域留白高度占比 */
  const buttomRatio = 0.14

  /** 左侧留白宽度 */
  const leftSpace = 34

  /** 右侧留白宽度 */
  const rightSpace = 34

  // 数据预处理，计算最高和最低温度
  let maxTemp = -999
  let minTemp = 999
  for (let i = 0; i < list.length; i++) {
    const temperature = parseInt(list[i].temperature, 10)
    maxTemp = maxTemp > temperature ? maxTemp : temperature
    minTemp = minTemp < temperature ? minTemp : temperature
  }

  /** 每度温度值所占的高度数值 */
  const heightPerTemp = (height * (maxRatio - minRatio)) / (maxTemp - minTemp)

  /** 每个格子所占的宽度 */
  const widthPerCell = (width - leftSpace - rightSpace) / cells

  // 计算每一个温度值坐标点
  const coordinate = []
  for (let i = 0; i < list.length; i++) {
    const x = widthPerCell * i + leftSpace
    const y =
      height * (1 - maxRatio) + heightPerTemp * (maxTemp - parseInt(list[i].temperature, 10))

    coordinate.push({
      x,
      y: Math.floor(y),
    })
  }

  // 初始化画布
  ctx.clearRect(0, 0, width, height)

  // 先画一个白色背景
  ctx.beginPath()
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  // 画温度折线
  ctx.beginPath()
  for (let i = 0; i < coordinate.length; i++) {
    const { x, y } = coordinate[i]
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 6
  ctx.stroke()

  // 在温度折线基础上画折线下区域
  ctx.lineTo(coordinate[coordinate.length - 1]['x'], height * (1 - buttomRatio))
  ctx.lineTo(leftSpace, height * (1 - buttomRatio))
  ctx.closePath()
  ctx.fillStyle = underLineColor
  ctx.fill()

  // 画温度值上的数字
  ctx.beginPath()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.font = '22px Arial'
  ctx.fillStyle = lineColor
  for (let i = 0; i < list.length; i++) {
    const { x, y } = coordinate[i]

    ctx.fillText(list[i].temperature + '℃', x, y - 6)
  }

  // 画底下的时刻值
  ctx.beginPath()
  ctx.fillStyle = '#333'
  for (let i = 0; i < list.length; i++) {
    const { x } = coordinate[i]

    ctx.fillText(list[i].hour + ':00', x, height - 10)
  }
}

module.exports = drawForecast24HoursLine
