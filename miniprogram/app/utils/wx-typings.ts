// 存放微信原生 TypeScript 类型（直接从 TypeScript 类型库中复制过来的）
// 为什么要有这份文件？
// 微信虽然给出了类型，但是在项目内如果直接引用（如下所示），则会报错，因此只能复制过来。
// import BaseEvent = WechatMiniprogram.BaseEvent

export type IAnyObject = Record<string, any>

export interface Target<DataSet extends IAnyObject = IAnyObject> {
  /** 事件组件的 id */
  id: string
  /** 当前组件的类型 */
  tagName?: string
  /** 事件组件上由 `data-` 开头的自定义属性组成的集合 */
  dataset: DataSet
  /** 距离页面顶部的偏移量 */
  offsetTop: number
  /** 距离页面左边的偏移量 */
  offsetLeft: number
}

/** 基础事件参数 */
export interface BaseEvent<
  Mark extends IAnyObject = IAnyObject,
  CurrentTargetDataset extends IAnyObject = IAnyObject,
  TargetDataset extends IAnyObject = CurrentTargetDataset
> {
  /** 事件类型 */
  type: string
  /** 页面打开到触发事件所经过的毫秒数 */
  timeStamp: number
  /** 事件冒泡路径上所有由 `mark:` 开头的自定义属性组成的集合 */
  mark?: Mark
  /** 触发事件的源组件 */
  target: Target<TargetDataset>
  /** 事件绑定的当前组件 */
  currentTarget: Target<CurrentTargetDataset>
}

/** 自定义事件 */
export interface CustomEvent<
  Detail extends IAnyObject = IAnyObject,
  Mark extends IAnyObject = IAnyObject,
  CurrentTargetDataset extends IAnyObject = IAnyObject,
  TargetDataset extends IAnyObject = CurrentTargetDataset
> extends BaseEvent<Mark, CurrentTargetDataset, TargetDataset> {
  /** 额外的信息 */
  detail: Detail
}

export interface AuthSetting {
  /** 是否授权通讯地址，已取消此项授权，会默认返回true */
  'scope.address'?: boolean
  /** 是否授权小程序在后台运行蓝牙，对应接口 [wx.openBluetoothAdapterBackground](#) */
  'scope.bluetoothBackground'?: boolean
  /** 是否授权摄像头，对应[[camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 */
  'scope.camera'?: boolean
  /** 是否授权获取发票，已取消此项授权，会默认返回true */
  'scope.invoice'?: boolean
  /** 是否授权发票抬头，已取消此项授权，会默认返回true */
  'scope.invoiceTitle'?: boolean
  /** 是否授权录音功能，对应接口 [wx.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) */
  'scope.record'?: boolean
  /** 是否授权用户信息，对应接口 [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) */
  'scope.userInfo'?: boolean
  /** 是否授权地理位置，对应接口 [wx.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) */
  'scope.userLocation'?: boolean
  /** 是否授权微信运动步数，对应接口 [wx.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) */
  'scope.werun'?: boolean
  /** 是否授权保存到相册 [wx.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [wx.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) */
  'scope.writePhotosAlbum'?: boolean
}
