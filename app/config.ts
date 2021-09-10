import { SecretItem, secret } from 'life-helper-miniprogram-secret'

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

/**
 * 基础日志等级
 *
 * 取值：
 * 'ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
 */
export type LoggerLevel = 'ALL' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE'

/** 配置项 */
export interface Config {
  /** 环境名称 */
  stage: Stage

  /** 基础日志等级 */
  loggerLevel: LoggerLevel

  /** URL 前缀部分 */
  baseURL: string

  /** 是否开启签名 */
  enableSign: boolean

  /** 私密配置 */
  secret?: SecretItem
}

/**
 * 本地开发环境特有配置
 */
const localConfig: Config = {
  /** 环境名称 */
  stage: 'local',

  /** 基础日志等级 */
  loggerLevel: 'DEBUG',

  baseURL: 'https://api-local.lifehelper.com.cn',

  /** 是否开启签名 */
  enableSign: false,
}

/**
 * 测试环境特有配置项
 */
const deveConfig: Config = {
  /** 环境名称 */
  stage: 'development',

  /** 基础日志等级 */
  loggerLevel: 'DEBUG',

  baseURL: 'https://api-test.lifehelper.com.cn',

  /** 私密配置 */
  secret: secret.development,

  /** 是否开启签名 */
  enableSign: true,
}

/**
 * 生产环境特有配置项
 */
const prodConfig: Config = {
  /** 环境名称 */
  stage: 'production',

  /** 基础日志等级 */
  loggerLevel: 'DEBUG',

  baseURL: 'https://api.lifehelper.com.cn',

  // 临时测试域名
  // baseURL: 'https://api-test.lh.inlym.com/',

  /** 私密配置 */
  secret: secret.production,

  /** 是否开启签名 */
  enableSign: true,
}

function getConfig(stage: Stage): Config {
  if (stage === 'local') {
    return localConfig
  } else if (stage === 'development') {
    return deveConfig
  } else if (stage === 'production') {
    return prodConfig
  } else {
    return deveConfig
  }
}

export const config = getConfig(stage)
