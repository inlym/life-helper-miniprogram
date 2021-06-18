export function getCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        resolve(res.code)
      },
      fail() {
        reject(new Error('调用 wx.login 失败!'))
      },
    })
  })
}
