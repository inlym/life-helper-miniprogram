import {IAnyObject, Target} from './wx-typings'

/** 点击事件类型 */
export interface TapEvent<DataSet extends IAnyObject = IAnyObject> {
  currentTarget: Target<DataSet>
}
