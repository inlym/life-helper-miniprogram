'use strict'

/**
 * 获取 canvas
 * @param {string}} id
 */
function getCanvas(id, options) {
  options = options || {}
  const { width = 300, height = 150 } = options

  return new Promise((resolve) => {
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

        const ctxName = `ctx_${id}`
        const canvasName = `canvas_${id}`

        this.setData({
          [ctxName]: ctx,
          [canvasName]: canvas,
        })

        resolve({ ctx, canvas })
      })
  })
}

module.exports = {
  getCanvas,
}
