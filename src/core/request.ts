import { create, JsHttpRequestConfig, JsHttpResponse, JsHttpInstance } from 'jshttp'
import { getCode } from './wxp'
import { config } from 'src/config/config'

/** 在小程序 storage 中用于存储 token 的字段名 */
const TOKEN_FIELD = '__app_token__'

/**
 * 添加鉴权信息中间件
 */
async function authInterceptor(config: JsHttpRequestConfig): Promise<JsHttpRequestConfig> {
  const token: string = wx.getStorageSync(TOKEN_FIELD)
  if (token && config.url.indexOf('/login') === -1) {
    config.headers['authorization'] = `TOKEN ${token}`
  } else {
    const code = await getCode()
    config.headers['authorization'] = `CODE ${code}`
  }

  return config
}

/**
 * 存储 token
 */
function saveTokenInterceptor(response: JsHttpResponse): JsHttpResponse {
  if (response.data && response.data.token) {
    wx.setStorageSync(TOKEN_FIELD, response.data.token)
  }
}

const defaultConfig: JsHttpRequestConfig = {
  baseURL: config.baseURL,
  signature: config.signature,
}

const request: JsHttpInstance = create(defaultConfig)

request.interceptors.request.use(authInterceptor)
request.interceptors.response.use(saveTokenInterceptor)

export { request }
