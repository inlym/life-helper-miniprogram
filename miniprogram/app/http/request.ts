import axios from 'axios'
import {config} from '../core/config'
import {aliyunApigwSignatureInterceptorBuilder} from './aliyun-apigw-signature-interceptor'
import {authInterceptor} from './auth-interceptor'
import {invalidTokenInterceptor} from './invalid-token-interceptor'
import {miniprogramAdapter} from './miniprogram-adatper'
import {requestLogInterceptor} from './request-log-interceptor'
import {securityTokenInterceptor} from './security-token-interceptor'

const instance = axios.create({
  baseURL: config.baseURL,
  adapter: miniprogramAdapter,
  validateStatus: function (status: number): boolean {
    return status >= 200 && status <= 599
  },
})

// 请求拦截器（先添加的后执行）
instance.interceptors.request.use(
  aliyunApigwSignatureInterceptorBuilder(config.signature.key, config.signature.secret, false)
)
instance.interceptors.request.use(securityTokenInterceptor)
instance.interceptors.request.use(authInterceptor)
// instance.interceptors.request.use(showLoadingInterceptor)

// 响应拦截器
// instance.interceptors.response.use(hideLoadingInterceptor)
instance.interceptors.response.use(invalidTokenInterceptor)
instance.interceptors.response.use(requestLogInterceptor)

export const request = instance
