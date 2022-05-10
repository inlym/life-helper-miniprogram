import {MiniProgramInfo} from './system.interface'

/** 小程序启动时需要上报的信息 */
export interface LaunchInfo extends MiniProgramInfo {
  /** 上报时间（时间戳） */
  reportTime: number
}
