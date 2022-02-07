export function sleep(n: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(n)
    }, n * 1000)
  })
}

export async function wait(title: string, n = 1): Promise<void> {
  await wx.showLoading({
    title: title,
    mask: true,
  })
  await sleep(n)
  await wx.hideLoading()
}

export async function reset(): Promise<void> {
  const modal = await wx.showModal({
    title: '重要提示',
    content: '请在小程序遇到无法操作的情况下点击，是否继续？',
    cancelText: '返回',
    confirmText: '确认继续',
    confirmColor: '#fa5151',
  })

  // 点击 “返回” 就直接退出
  if (!modal.confirm) {
    return
  }

  await wait('准备中...', 2)

  await wait('正在清理缓存...', 2)

  // 清理缓存
  await wx.clearStorage()

  await wait('正在更新版本...', 3)
  const updateManage = wx.getUpdateManager()
  updateManage.applyUpdate()

  await wx.showToast({ title: '修复完成！', icon: 'none' })

  await wait('即将跳转到首页...', 2)
  await wx.switchTab({ url: '/pages/index/index' })
  await wx.startPullDownRefresh()
}
