/**
 * 在 canvas 中画逐日温度折线图
 */
import {WeatherDaily} from './weather_data'

/** X 轴和 Y 轴上的坐标 */
export interface Coordinate {
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
  const minCoordinates: Coordinate[] = []

  // 最大温度折线坐标
  const maxCoordinates: Coordinate[] = []

  for (let i = 0; i < minList.length; i++) {
    const x = (i + 0.5) * gridWidth
    const minY = getY(minList[i])
    const maxY = getY(maxList[i])

    minCoordinates[i] = {x, y: minY}
    maxCoordinates[i] = {x, y: maxY}
  }

  // 开始画图
  ctx.lineWidth = 6
  const maxLineColor = '#e36286'
  const minLineColor = '#599bfd'

  // 画高温线
  ctx.beginPath()
  ctx.strokeStyle = maxLineColor
  for (let i = 0; i < maxCoordinates.length; i++) {
    ctx.lineTo(maxCoordinates[i].x, maxCoordinates[i].y)
  }
  ctx.stroke()

  // 画低温线
  ctx.beginPath()
  ctx.strokeStyle = minLineColor
  for (let i = 0; i < minCoordinates.length; i++) {
    ctx.lineTo(minCoordinates[i].x, minCoordinates[i].y)
  }
  ctx.stroke()

  // 画高温线的点
  for (let i = 0; i < maxCoordinates.length; i++) {
    const x = maxCoordinates[i].x
    const y = maxCoordinates[i].y

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
  for (let i = 0; i < minCoordinates.length; i++) {
    const x = minCoordinates[i].x
    const y = minCoordinates[i].y

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
