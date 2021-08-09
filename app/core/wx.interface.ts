interface CurrentTarget<T> {
  /** 事件组件的 id */
  id: string

  /** 事件组件上由 `data-` 开头的自定义属性组成的集合 */
  dataset: T
}

/** 普通点击事件 */
export interface TapEvent<T = any> {
  /** 事件类型 */
  type: string

  /** 页面打开到触发事件所经过的毫秒数 */
  timeStamp: number

  /** 事件绑定的当前组件 */
  currentTarget: CurrentTarget<T>
}
