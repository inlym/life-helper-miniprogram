import { makeUrl } from './utils'

/**
 * 页面普通跳转
 *
 * @param path 跳转路径
 * @param params 参数
 */
export function goTo(path: string, params: Record<string, string | number | boolean>): void {
  wx.navigateTo({
    url: makeUrl(path, params),
  })
}
