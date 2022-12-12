/**
 * 点击事件类型
 *
 * ## 备注
 * 该事件类型经常用到，且原生的类型不好用，因此自定义了一个便于内部调用。
 */
export interface TapEvent<T = any> {
  currentTarget: {
    dataset: T
  }
}

/** 只包含一个 id 属性的类型，一般用在页面入参 */
export interface Id {
  id: string
}

/** 通用列表响应数据 */
export interface CommonListResponse<T> {
  list: T[]
}
