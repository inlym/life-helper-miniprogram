/**
 * 环境名称
 * 1. 对接的服务端环境，发版前务必改为 'production'
 *
 * 取值：
 * - `production`   => 生产环境
 * - `development`  => 测试环境
 * - `local`        => 本地开发环境
 */
export const stage = 'production'

/**
 * 基础日志等级
 *
 * 取值：
 * 'ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
 */
export const loggerLevel = 'DEBUG'

/**
 * 公共配置，不区分环境的配置项
 */
const defaultConfig = { stage, loggerLevel }

/**
 * 本地开发环境特有配置
 */
const localConfig = {
  baseURL: 'https://api-local.lifehelper.com.cn',
}

/**
 * 测试环境特有配置项
 */
const deveConfig = {
  baseURL: 'https://api-test.lifehelper.com.cn',
}

/**
 * 生产环境特有配置项
 */
const prodConfig = {
  baseURL: 'https://api.lifehelper.com.cn',
}

const configs = {
  local: localConfig,
  production: prodConfig,
  development: deveConfig,
}

export const config = {
  ...defaultConfig,
  ...configs[stage],
}
