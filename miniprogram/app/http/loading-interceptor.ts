import {AxiosRequestConfig, AxiosResponse} from 'axios'
import {enhancedStorage} from '../core/storage'
import {ParamsUtils} from '../utils/params-utils'
import {RequestOptionsInternal} from './types'

/**
 * 静默时长，在该时间内结束请求则不弹 Loading
 */
const SILENCE_DURATION = 500

/**
 * 等待标志展示时长，超过该时间仍未结束请求则隐藏 Loading
 */
const LOADING_DURATION = 2000

/**
 * 请求状态
 */
enum RequestStatus {
  /** 请求未完成 */
  UNFINISHED = 1,

  /** 请求已完成 */
  FINISHED = 2,
}

function getKey(config: AxiosRequestConfig): string {
  return `loading:${config.method?.toLowerCase()}:${config.url}:${ParamsUtils.encode(config.params)}`
}

/**
 * 等待标志展示拦截器
 *
 * ### 主要用途
 * 个别需要即时反馈的 API，如果请求时间较久，则展示 Loading 标志。
 *
 * ### 不需要 Loading 的情况
 * 1. API 在背后默默运行，不需要即时反馈。
 * 2. 请求等待状态被页面接管，需要反映在页面上。例如提交时，提交按钮一直转圈等待。
 */
export function showLoadingInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const loading = (config as unknown as RequestOptionsInternal).loading

  if (loading) {
    const key = getKey(config)
    enhancedStorage.set(key, RequestStatus.UNFINISHED, 60 * 1000)

    setTimeout(() => {
      if (enhancedStorage.get(key) === RequestStatus.UNFINISHED) {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        })
        enhancedStorage.set('isShowingLoading', true)

        setTimeout(() => {
          if (enhancedStorage.get(key) === RequestStatus.UNFINISHED) {
            if (enhancedStorage.get('isShowingLoading') === true) {
              enhancedStorage.remove('isShowingLoading')
              wx.hideLoading({
                noConflict: true,
              })
            }
          }
        }, LOADING_DURATION)
      }
    }, SILENCE_DURATION)
  }

  return config
}

/**
 * 关闭等待标志拦截器
 */
export function hideLoadingInterceptor(response: AxiosResponse): AxiosResponse {
  const config = response.config
  const loading = (config as unknown as RequestOptionsInternal).loading

  if (loading) {
    const key = getKey(config)
    enhancedStorage.set(key, RequestStatus.FINISHED, 60 * 1000)
    if (enhancedStorage.get('isShowingLoading') === true) {
      enhancedStorage.remove('isShowingLoading')
      wx.hideLoading({
        noConflict: true,
      })
    }
  }

  return response
}
