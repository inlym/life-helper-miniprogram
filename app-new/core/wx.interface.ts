/**
 * 当前文件存放直接从 `miniprogram-api-typings` 库复制的文件
 */

interface IShareAppMessageOption {
  /** 转发事件来源。
   *
   * 可选值：
   * - `button`：页面内转发按钮；
   * - `menu`：右上角转发菜单。
   *
   * 最低基础库： `1.2.4`
   */
  from: 'button' | 'menu' | string
  /** 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined`
   *
   * 最低基础库： `1.2.4` */
  target: any
  /** 页面中包含`<web-view>`组件时，返回当前`<web-view>`的url
   *
   * 最低基础库： `1.6.4`
   */
  webViewUrl?: string
}

interface ICustomShareContent {
  /** 转发标题。默认值：当前小程序名称 */
  title?: string
  /** 转发路径，必须是以 / 开头的完整路径。默认值：当前页面 path */
  path?: string
  /** 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，最低基础库： `1.5.0`。默认值：使用默认截图 */
  imageUrl?: string
}

interface ICustomTimelineContent {
  /** 自定义标题，即朋友圈列表页上显示的标题。默认值：当前小程序名称 */
  title?: string
  /** 自定义页面路径中携带的参数，如 `path?a=1&b=2` 的 “?” 后面部分 默认值：当前页面路径携带的参数 */
  query?: string
  /** 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG。显示图片长宽比是 1:1。默认值：默认使用小程序 Logo*/
  imageUrl?: string
}

interface IPageScrollOption {
  /** 页面在垂直方向已滚动的距离（单位px） */
  scrollTop: number
}

interface ITabItemTapOption {
  /** 被点击tabItem的序号，从0开始，最低基础库： `1.9.0` */
  index: string
  /** 被点击tabItem的页面路径，最低基础库： `1.9.0` */
  pagePath: string
  /** 被点击tabItem的按钮文字，最低基础库： `1.9.0` */
  text: string
}

interface IResizeOption {
  size: {
    /** 变化后的窗口宽度，单位 px */
    windowWidth: number
    /** 变化后的窗口高度，单位 px */
    windowHeight: number
  }
}

interface IAddToFavoritesOption {
  /** 页面中包含web-view组件时，返回当前web-view的url */
  webviewUrl?: string
}

interface IAddToFavoritesContent {
  /** 自定义标题，默认值：页面标题或账号名称 */
  title?: string
  /** 自定义图片，显示图片长宽比为 1：1，默认值：页面截图 */
  imageUrl?: string
  /** 自定义query字段，默认值：当前页面的query */
  query?: string
}

export interface PageOptions {
  onLoad(query: Record<string, string | undefined>): void | Promise<void>

  onShow(): void | Promise<void>

  onReady(): void | Promise<void>

  onHide(): void | Promise<void>

  onUnload(): void | Promise<void>

  onPullDownRefresh(): void | Promise<void>

  onReachBottom(): void | Promise<void>

  onShareAppMessage(options: IShareAppMessageOption): ICustomShareContent | void

  onShareTimeline(): ICustomTimelineContent | void

  onPageScroll(options: IPageScrollOption): void | Promise<void>

  onTabItemTap(options: ITabItemTapOption): void | Promise<void>

  onResize(options: IResizeOption): void | Promise<void>

  onAddToFavorites(options: IAddToFavoritesOption): IAddToFavoritesContent

  setData(data: Record<string, any>): void

  route: string
}
