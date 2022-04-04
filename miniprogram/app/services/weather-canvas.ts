/**
 * 在 canvas 中画逐日温度折线图
 */

import {WeatherDaily} from './weather-data.interface'

/** X 轴和 Y 轴上的坐标 */
export interface Point {
  x: number

  y: number
}

export function drawWeatherDailyLineChart(ctx: CanvasRenderingContext2D, list: WeatherDaily[]): void {
  // 一天一个格子，计算每个格子的宽度
  const gridWidth = ctx.canvas.width / list.length

  // 格子高度等同于 canvas 的高度
  const gridHeight = ctx.canvas.height

  // 有效内容占比，即在 y 轴方向上，内容占比，剩下的为留白区域，无任何内容
  const contentRadio = 0.8

  // 最小温度列表
  const minList: number[] = list.map((item: WeatherDaily) => parseInt(item.tempMin))

  // 最大温度列表
  const maxList: number[] = list.map((item: WeatherDaily) => parseInt(item.tempMax))

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
