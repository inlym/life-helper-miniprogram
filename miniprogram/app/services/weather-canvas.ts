/**
 * 在 canvas 中画逐日温度折线图
 */

import {WeatherDailyItem, WeatherHourlyItem} from './weather-data.interface'

/** X 轴和 Y 轴上的坐标 */
export interface Point {
  x: number

  y: number
}

/**
 * 画未来 24 小时预报温度折线图
 *
 * @param ctx 画笔
 * @param list 未来 24 小时预报数据
 * @param theme 主题（`light` | `dark`）
 */
export function drawWeatherHourlyLineChart(
  ctx: CanvasRenderingContext2D,
  list: WeatherHourlyItem[],
  theme: string
): void {
  /** 线条颜色 */
  const LINE_COLOR = '#427bff'

  /** 温度字体颜色 */
  const TEXT_COLOR = theme === 'dark' ? '#d6d6d6' : '#040404'

  /** 线条宽度 */
  const LINE_WIDTH = 6

  /** 文字宽度 */
  const TEXT_WIDTH = 2

  // 一天一个格子，计算每个格子的宽度
  const gridWidth = ctx.canvas.width / list.length

  // 格子高度等同于 canvas 的高度
  const gridHeight = ctx.canvas.height

  /** 折线图底部留空区域占比 */
  const bottomFreeRatio = 0.05

  /** 折线图顶部留空区域占比（顶部要留多一点，因为还要放温度数字） */
  const topFreeRatio = 0.3

  /** 温度列表 */
  const tempList: number[] = list.map((item: WeatherHourlyItem) => parseInt(item.temp))

  /** 温度最小值 */
  const minTemp = Math.min(...tempList)

  /** 温度最大值 */
  const maxTemp = Math.max(...tempList)

  /** 每 1 度温度占有的高度 */
  const heightPerTemp = (gridHeight * (1 - bottomFreeRatio - topFreeRatio)) / (maxTemp - minTemp)

  /** 坐标点 */
  const pointList: Point[] = tempList.map((temp: number, index: number) => {
    const x = (index + 0.5) * gridWidth
    const y = topFreeRatio * gridHeight + (maxTemp - temp) * heightPerTemp

    return {x, y}
  })

  // 开始画图
  ctx.lineWidth = LINE_WIDTH

  // 画温度线
  ctx.beginPath()
  ctx.strokeStyle = LINE_COLOR
  for (let i = 0; i < pointList.length; i++) {
    ctx.lineTo(pointList[i].x, pointList[i].y)
  }
  ctx.stroke()

  // 画温度线上的点
  ctx.fillStyle = LINE_COLOR
  pointList.forEach((point: Point) => {
    ctx.beginPath()
    ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
    ctx.fill()
  })

  // 标记温度文字
  ctx.beginPath()
  ctx.lineWidth = TEXT_WIDTH
  ctx.fillStyle = TEXT_COLOR
  ctx.font = '32px sans-serif'
  ctx.textAlign = 'center'

  pointList.forEach((point: Point, index: number) => {
    ctx.beginPath()
    ctx.fillText(`${tempList[index]}°`, point.x, point.y - 24)
  })
}

/**
 * 画未来 15 天预报温度折线图
 *
 * @deprecated
 */
export function drawWeatherDailyLineChart(ctx: CanvasRenderingContext2D, list: WeatherDailyItem[]): void {
  // 一天一个格子，计算每个格子的宽度
  const gridWidth = ctx.canvas.width / list.length

  // 格子高度等同于 canvas 的高度
  const gridHeight = ctx.canvas.height

  // 有效内容占比，即在 y 轴方向上，内容占比，剩下的为留白区域，无任何内容
  const contentRadio = 0.8

  // 最小温度列表
  const minList: number[] = list.map((item: WeatherDailyItem) => parseInt(item.tempMin))

  // 最大温度列表
  const maxList: number[] = list.map((item: WeatherDailyItem) => parseInt(item.tempMax))

  // 最小温度值
  const minTemp = Math.min(...minList)

  // 最大温度值
  const maxTemp = Math.max(...maxList)

  // 每一度（℃）占有的高度
  const heightPerTemp = (gridHeight * contentRadio) / (maxTemp - minTemp)

  /**
   * 根据温度值获取 y 轴的坐标
   * @param temp 温度值
   */
  function getY(temp: number): number {
    return (gridHeight * (1 - contentRadio)) / 2 + (maxTemp - temp) * heightPerTemp
  }

  // 最小温度折线坐标
  const minPoints: Point[] = []

  // 最大温度折线坐标
  const maxPoints: Point[] = []

  for (let i = 0; i < minList.length; i++) {
    const x = (i + 0.5) * gridWidth
    const minY = getY(minList[i])
    const maxY = getY(maxList[i])

    minPoints[i] = {x, y: minY}
    maxPoints[i] = {x, y: maxY}
  }

  // 开始画图
  ctx.lineWidth = 6
  const maxLineColor = '#e36286'
  const minLineColor = '#599bfd'

  // 画高温线
  ctx.beginPath()
  ctx.strokeStyle = maxLineColor
  for (let i = 0; i < maxPoints.length; i++) {
    ctx.lineTo(maxPoints[i].x, maxPoints[i].y)
  }
  ctx.stroke()

  // 画低温线
  ctx.beginPath()
  ctx.strokeStyle = minLineColor
  for (let i = 0; i < minPoints.length; i++) {
    ctx.lineTo(minPoints[i].x, minPoints[i].y)
  }
  ctx.stroke()

  // 画高温线的点
  for (let i = 0; i < maxPoints.length; i++) {
    const x = maxPoints[i].x
    const y = maxPoints[i].y

    ctx.beginPath()
    ctx.fillStyle = maxLineColor
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 画低温线的点
  for (let i = 0; i < minPoints.length; i++) {
    const x = minPoints[i].x
    const y = minPoints[i].y

    ctx.beginPath()
    ctx.fillStyle = minLineColor
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
  }
}
