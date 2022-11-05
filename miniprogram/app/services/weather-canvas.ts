/**
 * 在 canvas 中画逐日温度折线图
 */

import {WeatherHourly} from './weather-data'

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
export function drawWeatherHourlyLineChart(ctx: CanvasRenderingContext2D, list: WeatherHourly[], theme: string): void {
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
  const tempList: number[] = list.map((item: WeatherHourly) => parseInt(item.temp))

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
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

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
