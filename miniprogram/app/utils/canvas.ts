/**
 * 创建并初始化 Canvas
 *
 * ## 备忘
 * 官方的示例方案，基于 canvas 的宽高使用 px，而本项目会使用 rpx，因此略作调整。
 *
 * ## 使用说明
 *
 * ```typescript
 * // 获取 ctx
 * const ctx = await createCanvasContext('#my-canvas')
 *
 * // 获取 canvas 宽高
 * const width = ctx.canvas.width
 * const height = ctx.canvas.height
 *
 * // 后续在使用 w 和 好 参数时，不要当作 px，而是作为 canvas 宽高的百分比
 * // 例如要画 1 个面积占比 1/4 的矩形
 * ctx.fillRect(0, 0, ctx.canvas.width / 2, ctx.canvas.height / 2)
 * ```
 *
 * @param selector Canvas 的选择器名称
 */
export function createCanvasContext(selector: string): Promise<CanvasRenderingContext2D> {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query
      .select(selector)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr

        // 备注：官方示例这里还有一句下面的语句，这里去掉了，原因见上方备忘
        // ctx.scale(dpr, dpr)

        resolve(ctx)
      })
  })
}
