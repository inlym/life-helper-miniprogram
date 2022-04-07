/**
 * 配置文件
 */

import {secret, Signature} from 'life-helper-miniprogram-secret'

/**
 * 环境名称
 * 1. 对接的服务端环境，发版前务必改为 'production'
 *
 * 取值：
 * - `production`   => 生产环境
 * - `development`  => 测试环境
 * - `local`        => 本地开发环境
 */
export type Stage = 'production' | 'development' | 'local'

export const stage: Stage = 'production'

/** 配置项数据类型 */
export interface Config {
  /** 环境名称 */
  stage: Stage

  /** URL 前缀部分 */
  baseURL: string

  /** 签名密钥 */
  signature: Signature
}

const localConfig: Config = {
  stage: 'local',
  baseURL: 'http://127.0.0.1:23010',
  signature: secret.development.signature,
}

const devConfig: Config = {
  stage: 'development',
  baseURL: 'https://api-test.lifehelper.com.cn',
  signature: secret.development.signature,
}

const prodConfig: Config = {
  stage: 'production',
  baseURL: 'https://api.lifehelper.com.cn',
  signature: secret.production.signature,
}

/** 封装获取配置的方法 */
function getConfig(stage: Stage): Config {
  if (stage === 'local') {
    return localConfig
  } else if (stage === 'production') {
    return prodConfig
  } else {
    return devConfig
  }
}

export const config = getConfig(stage)
