/**
 * 封装微信原生方法
 */

/**
 * 展示单按钮的模态框
 *
 * @param content 文本内容
 */
export async function showSingleButtonModel(content: string) {
  const res = await wx.showModal({
    title: '提示',
    content,
    showCancel: false,
    confirmText: '我知道了',
  })

  return res.confirm
}
