'use strict'

/**
 * 获取 canvas
 * @this WechatMiniprogram.Page.Instance
 * @since 0.1.0
 * @param {string}} id canvas id
 * @returns {Promise<{ctx:CanvasRenderingContext2D;canvas:canvas;}>}
 */
exports.getCanvas = function getCanvas(id, width = 300, height = 150) {
  return new Promise((resolve) => {
    /** 在 data 中存储的 ctx 变量名 */
    const ctxName = `__ctx_${id}__`

    /** 在 data 中存储的 canvas 变量名 */
    const canvasName = `__canvas_${id}__`

    if (this.data[ctxName] && this.data[canvasName]) {
      resolve({
        ctx: this.data[ctxName],
        canvas: this.data[canvasName],
      })
    } else {
      wx.createSelectorQuery()
        .select(`#${id}`)
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          canvas.width = width
          canvas.height = height

          this.setData({
            [ctxName]: ctx,
            [canvasName]: canvas,
          })
          resolve({ ctx, canvas })
        })
    }
  })
}
